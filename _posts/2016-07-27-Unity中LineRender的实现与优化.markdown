---
layout:     post
title:      "Unity中LineRender的实现与优化"
subtitle:   "腾讯实习技术第一炮"
date:       2016-07-25 12:00:00
author:     "George"
header-img: "img/post-bg-unity.jpg"
tags:
    - Unity
    - 技术
    - 腾讯
---

## 闲聊

[Line Renderer](https://docs.unity3d.com/Manual/class-LineRenderer.html)，简单来说就是在一个三维的空间中生成一条线。既然是线，那么我们无论从那个角度上去看，都能看到他的正面对吧，毕竟线是在二位平面中的事物。那么在三维平面中，这个line是怎么做到的呢？其实很简单，我们镜头在旋转的过程中，保持line的正面始终面对着镜头就可以了。可能有人会说为什么不用一个圆柱体来搞定。原因很简单，圆柱体太重量级了，想象我们是在玩一个FPS游戏，我们不可能对每一个弹道都用一个圆柱体来表示吧，使用line renderer不仅仅可以实现一样的效果，而且开销更加小。

Line Renderer和Billboard还有一些不一样，billboard对着你的角度也是固定死的，也就是说，无论镜头怎么变，billboard在你眼前的模样始终是一样的，这被广泛应用在NPC头上的字中。而line，只要给我们看到正面就可以了。

给一张line的图片好了~

![img](/img/in-post/LineRenderer/line-render.png)

## 我们究竟要干什么呢

用过Unity的朋友都知道，Unity自带了一种Line Renderer，在Effect Component中可以找到。这个line可以调整的参数是，起点的位置，终点的位置，起点的宽度以及终点的宽度，如下图：

![img](/img/in-post/LineRenderer/para.png)

我想测试一下这个renderer的性能，于是我放了500个对象上去，发现他竟然用了500个draw call来一个一个画。嗯，是时候给Line Renderer瘦瘦身了！接下来我们就来自己实现这样一个line renderer，并且让他的性能比原生的更好。CPU的能耗很大一部分都在draw call上面，把这部分draw call给合并成一个，那么能耗会大大下降，而合并的方法，就是batch。Unity提供了静态Batch和动态Batch，当然也可以用代码手动创建Batch。除此之外，我们不能为一个GameObject创建Mesh Renderer，因为我们需要手动去batch，所以batch后的mesh也需要我们手动去绘制。

所以，整体的步骤如下：

1. 写一个脚本，脚本创建Mesh，设置vertice和index。
2. 在移动镜头的时候调整物体的位置，达到line的效果。
3. 创建一个MeshCombine的脚本，其中包含一个BatchList，类型是List<BatchInfo>，能够把line都添加进去。Line会根据他们的Material和Layer自动归类到相应的BatchInfo，而一个BatchInfo只需要一次DrawCall。

接下来我们就一步一步的来实现这个功能。

#### 脚本创建Mesh
这个其实比较简单，可以参考[这篇文章](http://www.cnblogs.com/kyokuhuang/p/4191169.html)。需要注意的是，文章中创建的是一个立方体，而我们只需要创建一个正方形。

这里还有一点是可以优化的，刚才我们说，line只会把正面给镜头看，也就是说在游戏运行时，玩家是看不到物体的背面的，所以我们也不需要为背面划分三角形创建Index。综上所述，我们只要创建一个单一面的正方形。一共有4个定点，2个三角形，6个索引。

#### Line效果实现
这里需要一点点数学的知识，不知道大家还记不记得向量叉乘相关的知识，不记得的[猛戳我](https://zh.wikipedia.org/wiki/%E5%90%91%E9%87%8F%E7%A7%AF)。

假设我们现在知道了line的起点，终点的位置，但是他并不是面向镜头的，我们现在要让他转向镜头，可以用下面的方法：

1. 计算出起点和终点的中点，并且和镜头位置相连接，得到向量1。
2. 连接起点和终点，得到向量2。
3. 向量1与向量2进行叉乘，我们得到一个垂直于他们的向量3。向量3需要标准化。
4. 向量2作为轴，将line进行旋转，使得平面与向量3平行。

上面四个步骤完成之后，我们就会发现line已经转向镜头了。这样我们无论怎么移动镜头，都是不会看到line的背面的。

第四步旋转其实也非常简单，根据起点和终点的位置，起点和终点的宽度以及向量3就可以计算出line的四个顶点坐标，然后绘制即可。具体的代码如下：

```
float halfTailWidth = TailWidth / 2;
float halfHeadWidth = HeadWidth / 2;
Vector3 viewer = Camera.main.transform.position - HeadPosition;
Vector3 lineDir = HeadPosition - TailPosition;
Vector3 direction = Vector3.Cross(viewer, lineDir).normalized;

m_Vertices[0] = TailPosition - direction * halfTailWidth;
m_Vertices[1] = TailPosition + direction * halfTailWidth;
m_Vertices[2] = HeadPosition - direction * halfHeadWidth;
m_Vertices[3] = HeadPosition + direction * halfHeadWidth;
```

#### 创建一个MeshCombine
现在到了我们真正节约开销的部分了。之前提到过，在MeshCombine中需要有一个List<BatchInfo>，这个List中每一个元素代表需要batch到一起的对象。怎么样的对象需要batch到一起，很简单，就是他们的material和layer都是相同的。现在我们来看看BatchInfo的成员变量。

```
public class BatchInfo
{
    public int Layer;
    public Material Material;
    public List<CombineInstance> CombineInstance = new List<CombineInstance>();
    public CombineInstance[] CombineInstanceArray = null;
    public Mesh Mesh;
}
```

其中，Layer和Material都是相同的，ConbimeInstance是最终我们要combine在一起的物体对象集合，而Mesh就是combine出的结果，最终要绘制的东西，占用一个Draw Call的东西。

需要注意的是，我们在Line Renderer的脚本中的Update函数中计算四个顶点的位置，而计算完位置之后才能进行绘制，所以在这个脚本中我们绘制的代码需要放在LateUpdate函数中，具体如下：

```
void LateUpdate()
{
    for (int i = 0; i < BatchList.Count; ++i)
    {
        var batchInfo = BatchList[i];
        if (batchInfo.CombineInstanceArray == null)
        {
            if (batchInfo.CombineInstance.Count <= 0)
            {
                if (batchInfo.Mesh != null)
                {
                    Destroy(batchInfo.Mesh);
                }
                BatchList.RemoveAt(i);
                --i;
                continue;
            }
            batchInfo.CombineInstanceArray = batchInfo.CombineInstance.ToArray();
        }
        if (batchInfo.Mesh == null)
        {
            batchInfo.Mesh = new Mesh();
        }
        batchInfo.Mesh.CombineMeshes(batchInfo.CombineInstanceArray, true, false);
        Graphics.DrawMesh(batchInfo.Mesh, Matrix4x4.identity, batchInfo.Material, batchInfo.Layer);
    }
}
```
CombineMeshes函数就是把所有的Mesh合并成一个Mesh，DrawMesh就是讲Mesh绘制到屏幕上，占用一个Draw Call。

到此为止，我们的优化和实现已经全部完成了，下面来看看性能对比。

## 性能对比

我们先在安卓手机上创建2000个对象，并且挂载系统自带的Line Renderer，得到的性能图像如下：

![img](/img/in-post/LineRenderer/system.png)

我们只需要关注Camera.Render的耗时，因为这一项代表的就是draw call的耗时，也是我们可以优化的一项。我们发现数值大约为93ms。

现在我们挂载自己的Line Renderer，也是2000个对象：

![img](/img/in-post/LineRenderer/mine.png)

我们发现Camera.Render的耗时只有0.49ms！！足足快了大约190倍！可见batch的强大之处。那么这是不是意味着我们的Line Renderer就完胜系统的呢？其实不是的，在GPU的消耗上，我们略微的输给了系统的，但是因为CPU才是主要影响性能的因素，所以我们会把大部分的注意力都放在CPU上面，换句话说，我们的Line Renderer是成功的。

## 后记

可能是长期在写业务逻辑的缘故，对于这样的优化以及改进我一开始是无从下手的。但当我们真正“入门”之后，会发现优化是一件非常有趣非常有成就感的事情，我也能够感受到自己是一名“程序员”而不是“码农”，我想，不停的超越也是写代码的乐趣之一吧。









