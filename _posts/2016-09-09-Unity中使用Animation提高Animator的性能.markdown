---
layout:     post
title:      "Unity中使用Animation提高Animator的性能"
subtitle:   "腾讯实习技术第三炮"
date:       2016-09-09 13:00:00
author:     "George"
header-img: "img/post-bg-unity.jpg"
tags:
    - Unity
    - 技术
    - 腾讯
---

## 序言
这次我要跟大家分享的是使用Animation来实现Animator的功能。其实效果没有之前Curve那么酷炫，但是工作量比之前的会大上好多。

为什么要使用Animation来实现Animator呢？很大一部分原因是在于性能。Animator的性能是被人们所诟病的，在模拟之前我也不知道使用Animation能提高多少的性能，只是觉得可能是一种方式，所以就做了这件事。下面我们就进入正题，聊聊具体的方式。

## 正文
平台：Unity 4.6

### 概念与运作方式
首先我们来明确一下Animator的概念以及运作方式。Animator本质上就是一个组件（Component），可以挂载到任意一个GameObject上，其核心在于AnimatorController。我们平常所看到的AnimatorController的图形化结构是这样的：

![img](/img/in-post/Animation/1.png)

本质上而言，AnimatorController就是多个状态机的组合，其中的状态就是动画，而状态的转换就是动画的过渡。我们要实现的呢，就是状态机。只不过里面还有很多细节和其他功能比如Layer，BlendTree等。

我们从宏观到微观的角度来看controller，序号越小表示所包含的东西越多，概念越大：
1. controller本身，其中主要是paramaters和各个layer的基本信息。
2. layer，在animator中，我们对每一个layer都需要进行state和transition的更新。
3. stateMachine，通常来说，一个layer就是一个stateMachine，但是stateMachine也可以包含其他的sub-stateMachine。
4. state和transition，这些都是包含在stateMachine中的，也是controller中最核心的部分。
5. animationClip，包含在一个state中，真正动画播放的东西。

下面我们一个一个具体的介绍上述部件的功能。

#### Parameters
“参数”是用来控制Transition的发生的。当参数满足一个Transition触发的所有条件时，这个Transition就会执行。从图形化的角度来看，参数就是以下图来表示的：

![img](/img/in-post/Animation/2.png)

我们在代码中，可以通过SetInt，SetFloat等方法来修改参数的值。具体使用方法可以参考Unity手册。

#### Layer
Layer在AnimatorController中，表示如下：

![img](/img/in-post/Animation/3.png)

他的作用主要是用来控制不同层动画的混合，比如你有一个投掷的动画和一个走路的动画，你想上半身来投掷，下半身 走路的话，就可以通过Layer来实现。在Layer中我们看到有weight，Mask和Blending可以供开发者选择。weight用来控制混合 的权重，0表示不混合（动画不播放），其他数值会以一个融合的比重来播放动画，这里weight的值并不是绝对的，还会根据Blending的选择来更 改，如果Blending为Override，那么最终播放的时候当前层的动画会覆盖更浅层的动画，如果Blending为Additive，那么当前层 的weight会与更浅层的weight相加，再归一化。Mask是用来控制当前Layer的动画使用在身体的哪个部分的。我们可以在Unity中创建一 个Mask Avatar，通过设置它来达到控制身体部位的效果。

#### StateMachine

一个StateMachine就是一个状态机，也就是我们最直观的看到的那一块区域：

![img](/img/in-post/Animation/4.png)

通常来说，一个layer就是一个stateMachine，但是stateMachine也可以包含其他的sub-stateMachine。

#### State
State在AnimatorController中表示为：

![img](/img/in-post/Animation/5.png)

实际上，一个State就包含了一个动画或者多个动画的融合（BlendTree）。在每一个State中，我们都可以找到AnimationClip，而它就是真正被播放的东西。我们状态机就是在不同的State之间进行转换，也就是在不同的动画中进行过渡与播放。值得一提的是，我们有一个很特殊的State叫AnyState，它可以表示任何一个State，换句话说，从它发出的Transition可以看作是从其他State中发出的。

#### Transition
Transition就是在AnimatorController中的箭头，表示为：

![img](/img/in-post/Animation/6.png)

当我们选中一个Transition时，可以在右边看到触发时的条件，这些条件必须全部都满足时才会被触发。Transition是一个动画到另一个动画的过渡，这个过渡是有时间的。当过渡完成之后，动画的状态才会切换。有一类Transition的条件仅仅是Exit Time，表示当动画播放了一段时间后自动会触发这个Transition。

具体我们模拟Animator的时候，可以这么做（Update函数）：
1. 遍历每一个layer（可用多线程）
2. 在一个layer中，遍历当前state发出的所有transition，看看是否有所有conditions都满足的transition
3. 如果没有，结束
4. 如果有，则开始这个transition
5. transition是有时间的，所以当transition结束后，将当前的state设置成transition的dstState

### 实现

#### 解析
在实现这个Animator的时候，因为我们使用的是Unity 4.6，并没有与AnimatorController相关的API，所以我们需要自己解析controller文件。如果要看到controller文 件的原内容，我们需要设置一下Project Setting - Edtior，将其中的Aseet Serialization设置为Force Text，然后将controller文件使用任意编辑器打开（sublime），就能看到controller中所有的数据结构啦。我们在实际解析这些数据结构的时候，可以在代码中直接创建相应的类和成员变量，以State为例，在controller中他是这么表示的：

```
--- !u!1102 &110273390
State:
  m_ObjectHideFlags: 3
  m_PrefabParentObject: {fileID: 0}
  m_PrefabInternal: {fileID: 0}
  m_Name: Attack01
  m_Speed: 1
  m_CycleOffset: 0
  m_Motions:
  - {fileID: 7400000, guid: 904f2f79e9c87534f903a673c7adb132, type: 3}
  m_ParentStateMachine: {fileID: 110728656}
  m_Position: {x: -94, y: 183, z: 0}
  m_IKOnFeet: 0
  m_Mirror: 0
  m_Tag: 
```

我们创建的类如下：

```
public class State
{
    public int m_id;
    public string m_Name;
    public float m_Speed;
    public float m_CycleOffset;
    public bool m_IKOnFeet;
    public bool m_Mirror;

    public List<AnimationClip> m_Motions; // one motion per motion set  
    public BlendTree m_MotionsWithBlendTree;

    public StateMachine m_ParentStateMachine;
    public Vector3 m_Position;
    public string m_Tag;

    public State(int id)
    {
        m_id = id;
        m_Motions = new List<AnimationClip>();
    }
}
```

其中，id为controller中第一行最后的那一串数字，其他的成员变量名字和controller中的大致都是一样的。因为一个 State可能是一个BlendTree，所以我们添加了一个m_MotionsWithBlendTree来表示这个State对应的 BlendTree（如果有的话）。然后，m_Motions存储的就是要被Animation播放的动画片段。

这里有一点需要注意，我们需要将原来的动画片段复制一遍，把他的animationType设置成Lagecy，才能被Animation所支持。具体复制和设置的代码如下：

```
string animationPath = "Assets/Character/Animations/" + guid + state.m_id + ".FBX";
//AssetDatabase.CopyAsset(AssetDatabase.GUIDToAssetPath(guid), animationPath);
var animationObject = AssetDatabase.LoadAssetAtPath(animationPath, typeof(AnimationClip)) as AnimationClip;
if (!animationObject.name.Contains(state.m_id.ToString()))
      animationObject.name = animationObject.name + state.m_id;
AnimationUtility.SetAnimationType(animationObject, ModelImporterAnimationType.Legacy);
state.m_Motions.Add(animationObject);
state.m_MotionsWithBlendTree = null;
```

在上述代码中我们发现，我们对animationClip的名字进行的修改，原因在于，可能在不同Layer的两个State中有相同的AnimationClip，他们完全可以同时进行播放。在controller中，他们也是以不同的guid来表示的，说明他们是两个对象。而在Animation中，我们的Clip是以名字进行标识的，所以这里要给他们换一个名字。

最后一点需要注意的是，还记不记得我们之前说在Layer中可以添加Mask。我们打开.mask文件后，发现会有一些m_Path，我们把m_Weight为1的所有path当成字符串保存起来，之后在模拟的时候会使用到。

#### 模拟

解析完controller文件后，就可以模拟Animator的行为了。

首先我们要将所有的动画添加到Animation中去，在添加的时候，可以设置AnimationState.layer来实现不同layer的混合效果， 然后我们要实现mask的效果，可以使用函数AddMixingTransform，他接受两个参数，一个是transform，这里我们就可以使用解析 得到的m_Path了，使用transform.find(m_Path)就能得到我们真正需要的子transform（也就是mask），另一个参数表 示是否递归，这里根据.mask的文件结构来看，我们选择false即可。

另外需要注意的是，Animation没有直观的数据结构可以表示BlendTree，我们要根据parameter的值以及各个动画片段的threshold来计算出他们的权重。这里以1D为例，计算权重的函数如下：

```
void UpdateWeightsAndSpeedsInBlendTree1D(AnimatorCompiler.BlendTree blendTree)
{
      float para = floatConditions[blendTree.m_BlendParameter.m_Name];
      AnimatorCompiler.BlendTree.Child left = null;
      AnimatorCompiler.BlendTree.Child right = null;
      for (int i = 0; i < blendTree.m_Childs.Count; ++i)
      {
            AnimatorCompiler.BlendTree.Child child = blendTree.m_Childs[i];
            if (para >= child.m_Threshold && child.m_Threshold < blendTree.m_MaxThreshold)
            {
                  if (left == null || child.m_Threshold > left.m_Threshold)
                  {
                        left = child;
                  }
            }
            else if (para <= child.m_Threshold)
            {
                  if (right == null || child.m_Threshold < right.m_Threshold)
                  {
                        right = child;
                  }
            }
            weightInBlendTrees[blendTree][child] = 0.0f;
            speedInBlendTrees[blendTree][child] = 0.0f;
      }
      if (left != null && right != null)
      {
            float lp = 1 - (para - left.m_Threshold) / (right.m_Threshold - left.m_Threshold);
            float rp = 1 - lp;
            weightInBlendTrees[blendTree][left] = lp;
            weightInBlendTrees[blendTree][right] = rp;
            float leftTime = left.m_Motion.length / left.m_TimeScale;
            float rightTime = right.m_Motion.length / right.m_TimeScale;
            speedInBlendTrees[blendTree][left] = left.m_Motion.length / (leftTime * lp + rightTime * rp);
            speedInBlendTrees[blendTree][right] = right.m_Motion.length / (leftTime * lp + rightTime * rp);
      }
}
```

1D还是比较简单的，找到与parameter的值相邻的两个threshold，然后对这两个threshold所表示的AnimationClip的weight进行插值即可。2D的weight计算可以参考[这篇文章](http://runevision.com/thesis/rune_skovbo_johansen_thesis.pdf)的6.3节。

大部分的更新Transition的逻辑都在Update函数中完成，那么我们要怎么来模拟这个Transition的过程呢？一种比较显然的方法是使用CrossFade，我们来看看CrossFade的函数原型。

```
public void CrossFade(string animation, float fadeLength = 0.3F, PlayMode mode = PlayMode.StopSameLayer);
```

animation为我们的目标动画，fadeLength就是过渡的时间，也就是transition的时间。我们解析得到的m_TransitionDuration是一个百分比，需要乘上原动画的时间。 CrossFade的原理是，将animation的weight设置成1，enable设置成true，然后在fadeLength的时间内将原动画的 weight降为0，再把他的enable设置成false。这样就有一个问题，在blendTree中的动画不一定weight就为1，而且在高层的 Layer中的weight也不一定为1，所以我们不能直接使用CrossFade，而是自己将它实现一遍再进行一些修改，大致的代码如下：

```
foreach (var item in parser.animation.m_State)
{
      AnimatorCompiler.State state = item.Value;
      if (state.m_id == 0)
            continue;
      if (state.m_ParentStateMachine.m_Index == layer.m_Index)
      {
            if (state.m_id != transition.m_DstState.m_id)
            {
                  if (state.m_MotionsWithBlendTree == null)
                  {
                        gameObject.animation.Blend(state.m_Motions[0].name, 0, currentTransitionInLayers[layer].m_TransitionDuration * animationLength);
                  }
                  else
                  {
                        for (int j = 0; j < state.m_MotionsWithBlendTree.m_Childs.Count; ++j)
                        {
                              AnimatorCompiler.BlendTree.Child child = state.m_MotionsWithBlendTree.m_Childs[j];
                              gameObject.animation.Blend(child.m_Motion.name, 0, currentTransitionInLayers[layer].m_TransitionDuration * animationLength);
                        }
                  }
            }
      }
}
if (currentTransitionInLayers[layer].m_DstState.m_MotionsWithBlendTree == null)
{
      gameObject.animation.Stop(transition.m_DstState.m_Motions[0].name);
      gameObject.animation[transition.m_DstState.m_Motions[0].name].enabled = true;
      gameObject.animation[transition.m_DstState.m_Motions[0].name].weight = ((layer.m_Index == 0) ? 1 : layer.m_DefaultWeight);
}
else
{
      for (int i = 0; i < currentTransitionInLayers[layer].m_DstState.m_MotionsWithBlendTree.m_Childs.Count; ++i)
      {
            AnimatorCompiler.BlendTree.Child child = currentTransitionInLayers[layer].m_DstState.m_MotionsWithBlendTree.m_Childs[i];
            gameObject.animation.Stop(child.m_Motion.name);
            gameObject.animation[child.m_Motion.name].enabled = true;
            gameObject.animation[child.m_Motion.name].weight = weightInBlendTrees[currentTransitionInLayers[layer].m_DstState.m_MotionsWithBlendTree][child];
      }
}
```

剩下的部分只要细心耐心的按照animator模拟的步骤慢慢实现即可，没有什么太多的坑。

### 改进

好了，如果你按照上述的步骤写完了，然后想打包一下跃跃欲试，你会发现你失败了。原因是我们在复制AnimationClip的时候，使用了AssetDatabase，他是属于UnityEditor的一个类，而UnityEditor无法打包。因此我们需要把解析的过程放在Editor中完成，然后将解析的结果都串行化，保存起来。

你可以小心翼翼的在每个类上面加上[System.Serializable]，但是这么做依然是不行的，因为我们在类中表示其他的对象时，使用都是其他对象的指针，所以很容易就产生循环引用，在Editor中无法被串行化，例如，state类中有一个parentStateMachine指向一个StateMachine，而在一个StateMachine中又保存了他所有state的指针。

因此，我们需要修改整个解析得到的类的数据结构，将指针替换为对象的id（int类型）。以State为例，我们可以与之前的代码进行对比：

```
[System.Serializable]
public class State
{
      public int m_id;
      public string m_Name;
      public float m_Speed;
      public float m_CycleOffset;
      public bool m_IKOnFeet;
      public bool m_Mirror;

      public List<AnimationClip> m_Motions; // one motion per motion set    
      public int m_MotionsWithBlendTree;

      public int m_ParentStateMachine;
      public Vector3 m_Position;
      public string m_Tag;

      public State(int id)
      {
            m_id = id;
            m_Motions = new List<AnimationClip>();
            m_MotionsWithBlendTree = -1;
      }
}
```

由于我们把解析的过程放在了Editor中完成，因此运行的速度也会更快一些。

那么我们还有什么办法可以提高性能吗？

答案肯定是有的，这里就采用了“生成代码”的办法。我们真正运行时的逻辑代码，是在Editor中生成的，而不是提前写好的。可能听起来有点绕，我把我的工程的文件结构给大家看一下：

Editor：
- AnimatorCodeGenerator.cs：生成模拟Animator的代码
- AnimatorParser：解析controller文件

Scripts：
- AnimationByAnimator：模拟Animator
- AnimationController：控制gameObject
- AnimatorCompiler：controller文件的数据结构
- AnimatorData：用来存储解析controller文件后的结果
- CodeUtil：生成代码时使用的工具

这样应该清晰了很多，那么这么做有什么好处呢？

如果我们平常来写的话，必然会使用到大量的字典，比如parentStateMachineInStates，我们在解析的数据结构 中，parentStateMachine保存的是StateMachine的Id，只有id是没有办法直接在模拟代码中使用的，我们要把这个id换转成 真正的StateMachine的对象，因此他在模拟代码中的类型应该是Dictionary<State, StateMachine>。由于使用字典会产生大量的cache miss，因此性能并不出色。而生成代码最大的优势是能循环展开并且避免使用字典，其原理就在于能够“通过不同的字符串来运用变量”。

我们来看一个例子，在codeGenerator中，有这样的一段代码：

```
for (int i = 0; i < animation.m_Transition.Count; ++i)
{
      AnimatorCompiler.Transition transition = animation.m_Transition[i];
      code.Variable("", "AnimatorCompiler.State", code.Normalize("srcStateInTransitions_" + transition.m_id));
      code.Variable("", "AnimatorCompiler.State", code.Normalize("dstStateInTransitions_" + transition.m_id));
}
```

Variable函数就是创建响应的变量名。运行这段代码，生成的代码如下：

```
AnimatorCompiler.State srcStateInTransitions_110100396;
AnimatorCompiler.State dstStateInTransitions_110100396;
AnimatorCompiler.State srcStateInTransitions_110128666;
AnimatorCompiler.State dstStateInTransitions_110128666;
AnimatorCompiler.State srcStateInTransitions_110144588;
AnimatorCompiler.State dstStateInTransitions_110144588;
AnimatorCompiler.State srcStateInTransitions_110150974;
AnimatorCompiler.State dstStateInTransitions_110150974;
AnimatorCompiler.State srcStateInTransitions_110152432;
AnimatorCompiler.State dstStateInTransitions_110152432;
AnimatorCompiler.State srcStateInTransitions_110183908;
AnimatorCompiler.State dstStateInTransitions_110183908;
AnimatorCompiler.State srcStateInTransitions_110193682;
AnimatorCompiler.State dstStateInTransitions_110193682;
```

可以看到，原先的Dictionary被展开成了不同的变量，而且我们把循环函数放在了Editor中完成，因此运行时的效率会更高一些。而这些就是生成代码所给我们带来的好处。

不过，生成代码非常非常容易出错，大家在写的时候一定要仔细！

## 性能

测试时，我们重点关注Update函数消耗的时间，无论是Animator还是我们写的这个系统，Update函数始终都是核心，也是最最耗时的一部分。

这次我们依然在安卓机上测试，创建300个物体，先挂上Animator，得到的图如下：

![img](/img/in-post/Animation/7.png)

可以看到，所有Update函数的时间和为40.74+19.41=60.15ms。

现在我们来看看用我们的系统：

![img](/img/in-post/Animation/8.png)

总的Update函数时间为17.82+10.95+5.85=34.62ms。

我们可以看到，在平均情况下，Animation实现的系统已经比Animator快了接近一倍，而在实现中可以优化的地方依旧有很多，代码也不是最美观，如果你有什么好的建议，欢迎联系我！







