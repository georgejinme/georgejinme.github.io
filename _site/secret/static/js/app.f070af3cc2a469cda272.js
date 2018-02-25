webpackJsonp([1], {
    "2x6M": function(t, i) {},
    Ei9x: function(t, i) {},
    GIxI: function(t, i) {},
    NHnr: function(t, i, e) {
        "use strict";
        Object.defineProperty(i, "__esModule", { value: !0 });
        var s = e("7+uW"),
            r = {
                name: "Header",
                props: ["title", "description"],
                data: function() { return { backgroundHeight: window.innerHeight - 80, backgroundWidth: window.innerWidth - 220, left: window.innerWidth - 30, titleY: 100, titleSize: 100 } },
                methods: {
                    onScroll: function() {
                        var t = window.scrollY;
                        t < this.backgroundHeight ? (this.left = window.innerWidth - 30 - (window.innerWidth - 220) / this.backgroundHeight * t, this.titleY = 100 - 60 / this.backgroundHeight * t, this.titleSize = 100 - 80 / this.backgroundHeight * t) : (this.left = 190, this.titleY = 40, this.titleSize = 20)
                    }
                }
            },
            a = {
                render: function() {
                    var t = this,
                        i = t.$createElement,
                        e = t._self._c || i;
                    return e("div", { staticClass: "header" }, [e("div", { staticClass: "header-background", style: { height: t.backgroundHeight + "px", width: t.backgroundWidth + "px" } }), t._v(" "), e("div", { staticClass: "header-shadow", style: { left: t.left + "px", height: t.backgroundHeight + "px", width: t.backgroundWidth - t.left + 190 + "px" } }), t._v(" "), e("div", { staticClass: "header-title", style: { top: t.titleY + "px", "font-size": t.titleSize + "px" }, domProps: { innerHTML: t._s(t.title) } }), t._v(" "), e("div", { staticClass: "header-description", style: { width: t.backgroundWidth + "px" } }, [e("div", { staticClass: "header-description-line" }), t._v(" "), e("div", { staticClass: "header-description-text description", domProps: { innerHTML: t._s(t.description) } })])])
                },
                staticRenderFns: []
            };
        var n = e("VU/8")(r, a, !1, function(t) { e("Ei9x") }, "data-v-0d1ef378", null).exports,
            o = {
                name: "Timeline",
                props: { milestones: { type: Object }, heightTest: { type: Array } },
                data: function() { return { right: { upper: 200, value: 200, lower: 30 }, opacity: { upper: 1, value: 1, lower: .2 }, speed: .2, barHeight: 0 } },
                computed: {
                    barHeightUpperLimit: function() { return 2 * (this.heightTest.length - 1) * 60 },
                    scrollHeight: function() {
                        var t = new Array(this.heightTest.length);
                        t[0] = (this.right.upper - this.right.lower) / this.speed + window.innerHeight;
                        for (var i = 1; i < this.heightTest.length; ++i) t[i] = t[i - 1] + this.heightTest[i - 1];
                        return t
                    }
                },
                methods: {
                    onScroll: function() {
                        var t = window.scrollY;
                        if (t * this.speed < this.right.upper - this.right.lower ? (this.right.value = this.right.upper - t * this.speed, this.opacity.value = 1 - (1 - this.opacity.lower) / (this.right.upper - this.right.lower) * t * this.speed) : (this.right.value = this.right.lower, this.opacity.value = this.opacity.lower), t > (this.right.upper - this.right.lower) / this.speed + window.innerHeight) {
                            for (var i = this.scrollHeight.length - 1, e = 0; e < this.scrollHeight.length - 1; ++e)
                                if (t >= this.scrollHeight[e] && t < this.scrollHeight[e + 1]) { i = e; break }
                            var s = 120 * i,
                                r = (t - this.scrollHeight[i]) * (120 / this.heightTest[i]);
                            this.barHeight = s + r <= this.barHeightUpperLimit ? s + r : this.barHeightUpperLimit
                        }
                    }
                }
            },
            c = {
                render: function() {
                    var t = this.$createElement,
                        i = this._self._c || t;
                    return i("div", { staticClass: "timeline", style: { right: this.right.value + "px" } }, [this._l(this.milestones.history, function(t, e) { return i("div", { staticClass: "timeline-circle", attrs: { id: "timeline-circle-" + t.time } }, [i("img", { directives: [{ name: "tooltip", rawName: "v-tooltip", value: { content: t.time + "<br/>" + t.text, placement: "right-center", offset: 5 }, expression: "{\n        content: milestone.time + '<br/>' + milestone.text,\n        placement: 'right-center',\n        offset: 5\n      }" }], staticClass: "timeline-circle-img", attrs: { src: t.img } })]) }), this._v(" "), i("div", { staticClass: "timeline-circle-line", style: { opacity: this.opacity.value, height: this.barHeightUpperLimit + "px" } }), this._v(" "), i("div", { staticClass: "timeline-circle-line-sub", style: { height: this.barHeight + "px" } })], 2)
                },
                staticRenderFns: []
            };
        var g = e("VU/8")(o, c, !1, function(t) { e("mdgl") }, "data-v-320793da", null).exports,
            h = {
                name: "Story",
                props: { image: { type: Array }, title: { type: String }, text: { type: String }, margin: { type: Number } },
                mounted: function() { this.showImage(1) },
                computed: { textHeight: function() { return this.$refs.storyText.offsetHeight } },
                data: function() { return { marginTop: this.margin + window.innerHeight, gap: this.margin > 850 ? window.innerHeight : this.margin + window.innerHeight, left: 480, opacity: 0, display: "none", curr: 1 } },
                methods: {
                    getHeight: function() { return this.$refs.storyText.offsetHeight },
                    onScroll: function() {
                        var t = window.scrollY;
                        t < this.marginTop ? (this.left = 480, this.opacity = 0, this.display = "none") : t < this.marginTop + 200 ? (this.left = 480 - 2.2 * (t - this.marginTop), this.opacity = .005 * (t - this.marginTop), this.display = "block") : t >= this.marginTop + 200 && t <= this.marginTop + this.textHeight - 200 ? (this.left = 40, this.opacity = 1, this.display = "block") : t > this.marginTop + this.textHeight - 200 && t <= this.marginTop + this.textHeight ? (this.left = 40 - 2.2 * (t - this.marginTop - this.textHeight + 200), this.opacity = 1 - .005 * (t - this.marginTop - this.textHeight + 200), this.display = "block") : (this.left = -400, this.opacity = 0, this.display = "none")
                    },
                    showImage: function(t) {
                        for (var i in this.$refs) {
                            var e = this.$refs[i][0];
                            if (null != e && "IMG" == e.tagName && "story-shadow-img" == e.className) {
                                parseInt(i.slice(5)) == t ? e.style.display = "block" : e.style.display = "none";
                                var r = e.naturalWidth / e.naturalHeight;
                                r < window.innerWidth / window.innerHeight ? (e.style.height = window.innerHeight + "px", e.style.width = window.innerHeight * r + "px") : (e.style.width = window.innerWidth + "px", e.style.height = window.innerWidth / r + "px")
                            }
                        }
                    },
                    nextImg: function() { this.curr < this.image.length && (this.curr += 1, this.showImage(this.curr)) },
                    backImg: function() { this.curr > 1 && (this.curr -= 1, this.showImage(this.curr)) },
                    cancel: function() { this.$refs.shadow.style.display = "none" },
                    viewImg: function() { this.$refs.shadow.style.display = "block" }
                }
            },
            l = {
                render: function() {
                    var t = this,
                        i = t.$createElement,
                        e = t._self._c || i;
                    return e("div", { staticClass: "story", style: { "margin-top": t.gap + "px" } }, [e("div", { staticClass: "story-image", style: { left: t.left + "px", opacity: t.opacity, display: t.display } }, [e("img", { attrs: { src: t.image[0] }, on: { click: function(i) { i.stopPropagation(), t.viewImg(i) } } })]), t._v(" "), e("div", { ref: "storyText", staticClass: "story-text" }, [e("div", { staticClass: "story-text-title", domProps: { innerHTML: t._s(t.title) } }), t._v(" "), e("div", { staticClass: "story-text-line" }), t._v(" "), e("div", { staticClass: "story-text-content", domProps: { innerHTML: t._s(t.text) } })]), t._v(" "), e("div", { ref: "shadow", staticClass: "story-shadow" }, [e("img", { ref: "next", staticClass: "story-shadow-next", attrs: { src: "static/next.png" }, on: { click: function(i) { i.stopPropagation(), t.nextImg(i) } } }), t._v(" "), e("img", { ref: "back", staticClass: "story-shadow-back", attrs: { src: "static/back.png" }, on: { click: function(i) { i.stopPropagation(), t.backImg(i) } } }), t._v(" "), e("img", { ref: "cancel", staticClass: "story-shadow-cancel", attrs: { src: "static/cancel.png" }, on: { click: function(i) { i.stopPropagation(), t.cancel(i) } } }), t._v(" "), t._l(t.image, function(t, i) { return e("img", { ref: "image" + (i + 1), refInFor: !0, staticClass: "story-shadow-img", attrs: { src: t } }) })], 2)])
                },
                staticRenderFns: []
            };
        var p = {
                name: "App",
                components: { Header: n, Timeline: g, Story: e("VU/8")(h, l, !1, function(t) { e("2x6M") }, "data-v-a95eac64", null).exports },
                data: function() {
                    return {
                        storyImage: [
                            ["static/1/0.jpg", "static/1/1.jpg", "static/1/2.jpg", "static/1/3.jpg", "static/1/4.jpg", "static/1/5.jpg", "static/1/6.jpg", "static/1/7.jpg", "static/1/8.jpg", "static/1/9.jpg", "static/1/10.jpg"],
                            ["static/2/0.jpg"],
                            ["static/3/0.jpg", "static/3/1.jpg", "static/3/2.jpg", "static/3/3.jpg", "static/3/4.jpg", "static/3/5.jpg", "static/3/6.jpg", "static/3/7.jpg", "static/3/8.jpg", "static/3/9.jpg"],
                            ["static/4/0.jpg", "static/4/1.jpg", "static/4/2.jpg", "static/4/3.jpg", "static/4/4.jpg", "static/4/5.jpg", "static/4/6.jpg", "static/4/7.jpg", "static/4/8.jpg", "static/4/9.jpg", "static/4/10.jpg", "static/4/11.jpg", "static/4/12.jpg", "static/4/13.jpg", "static/4/14.jpg", "static/4/15.jpg", "static/4/16.jpg", "static/4/17.jpg"],
                            ["static/5/0.jpg", "static/5/1.jpg", "static/5/2.jpg", "static/5/3.jpg", "static/5/4.jpg", "static/5/5.jpg", "static/5/6.jpg", "static/5/7.jpg", "static/5/8.jpg", "static/5/9.jpg"],
                            ["static/6/0.jpg", "static/6/1.jpg", "static/6/2.jpg", "static/6/3.jpg", "static/6/4.jpg", "static/6/5.jpg", "static/6/6.jpg", "static/6/7.jpg", "static/6/8.jpg", "static/6/9.jpg", "static/6/10.jpg", "static/6/11.jpg", "static/6/12.jpg", "static/6/13.jpg", "static/6/14.jpg", "static/6/15.jpg", "static/6/16.jpg"],
                            ["static/7/0.jpg", "static/7/1.jpg", "static/7/2.jpg", "static/7/3.jpg"],
                            ["static/8/0.jpg", "static/8/1.jpg", "static/8/2.jpg"],
                            ["static/9/0.jpg", "static/9/1.jpg", "static/9/2.jpg", "static/9/3.jpg"]
                        ],
                        headerTitle: "To ツツさん",
                        headerDescription: "文笔很烂，思绪很乱，想到什么写什么。<br/>写这样一个网站其实是我已经计划了很久的事情，只不过因为来到东京后有很多需要整理和打扫的，所以迟迟没有开工。<br/>我来写这个网站，不是为了秀恩爱，锻炼技术更是无稽之谈。只是想，在没有办法见到面没有办法拥抱和牵手的异国恋面前，能够有一个地方，只属于我们两个，是我们两个人的世界。原本的打算就是当做情人节的礼物送给你，之前有提到过，送一些不需要寄回来的，即使你不在我身边也能够看到了，指的就是这个。<br/>嘛，又幼稚了一回，希望你能喜欢。",
                        milestones: { history: [{ time: "2017-12-02", text: "a", img: "static/test.jpg" }, { time: "2017-12-13", text: "b", img: "static/test.jpg" }, { time: "2017-12-19", text: "c", img: "static/test.jpg" }, { time: "2018-01-07", text: "d", img: "static/test.jpg" }, { time: "2018-01-18", text: "e", img: "static/test.jpg" }], target: "2018-04-01" },
                        storyMargins: [850, 2655 + window.innerHeight, 3724 + 2 * window.innerHeight, 4569 + 3 * window.innerHeight, 5446 + 4 * window.innerHeight, 6675 + 5 * window.innerHeight, 7648 + 6 * window.innerHeight, 8653 + 7 * window.innerHeight, 9626 + 8 * window.innerHeight]
                    }
                },
                created: function() { window.addEventListener("scroll", this.handleScroll) },
                destroyed: function() { window.removeEventListener("scroll", this.handleScroll) },
                methods: {
                    handleScroll: function() {
                        this.$refs.header.onScroll();
                        window.scrollY;
                        this.$refs.story1.onScroll(), this.$refs.story2.onScroll(), this.$refs.story3.onScroll(), this.$refs.story4.onScroll(), this.$refs.story5.onScroll(), this.$refs.story6.onScroll(), this.$refs.story7.onScroll(), this.$refs.story8.onScroll(), this.$refs.story9.onScroll()
                    }
                }
            },
            d = {
                render: function() {
                    var t = this,
                        i = t.$createElement,
                        e = t._self._c || i;
                    return e("div", { attrs: { id: "app" } }, [e("Header", { ref: "header", attrs: { title: t.headerTitle, description: t.headerDescription } }), t._v(" "), e("Story", { ref: "story1", attrs: { image: "static/test.jpg", title: "始める", text: "2017年11月16日。<br/>这是我们第一天相遇的日子。其实很久之前就想约你一起吃饭，原因嘛，除了本身就工作的很近以外，于私说实话本身也是想认识你的。本来应该是上周，我们两正好都在公司加班，你说你刚下班，就想着要不要一起吃饭，虽然当天没有约成，但是已经开始最初步的接触了。两个人互相商量着下周要吃什么，幸运的是我们都能吃辣，我当时提议火锅，说了一串理由，结果被你当场啪啪啪打脸，原话应该是，我觉得火锅人太多吃不好，因为锅就这么大，筷子会打架。发完一秒你就回，你觉得火锅应该人多吃好，热闹，哈哈哈。<br/>所以第二周我一直在盼着周四的到来，以前对短发和丸子头的姑娘有莫名的好感，然后我也知道你经常扎丸子头，所以会特别的期待。结果那一天果然你梳了个我很喜欢的发型，真的特别开心，然后又能一起吃川渝火锅。好像从第一天开始你的指甲就是‘摇摇欲坠’的，拧瓶盖把指甲给掀起来了，让我帮你还不要吼，做一个独立自主的女宝宝吼。<br/>然后，我也没有特别刻意去装gay嘛，就是我伪装一下嘛，不然和你两个人一起吃饭，你会不会觉得我意图太明显，而且是gay的话，以后约你吃饭动机也不会特别的不纯看上去。其实这是一件很矛盾的事情，gay嘛感觉就不能在一起，不gay嘛又不好约你，在小心思这方面我们还是有点像得嘛。<br/>第一次吃饭就把我们吃货的本性暴露出来了，我们两个人竟然吃了五百多，让人震惊，说实话我自己也没有吃过这么多。没记错的话，当天吃完饭我们还打了同一把伞，虽然只有在我打电话的期间，但是还是觉得自己可能没有被讨厌？？？真的是戏很多了可以算。从那一天起，我们的话就渐渐的开始多了起来，我买鞋子也会给你拍照片然后问你的意见，怎么讲，可能自己内心已经开始对你有好感了吧。<br/>然后就是2017年11月18日，这一天是群聚会，大家一起去gay吧玩。结果很不巧，那一天你爸妈来了，所以下午的桌游和晚上的晚饭你都没有来参加。gay吧的体验并不好，人实在是太多了，所幸大家人都没有走散，你和根姐在一起也很放心。突然想起来我自己好像还在你们面前摇摆，现在感觉自己好蠢。。。<br/>那一天我们通宵了，最后一场是在啤酒阿姨，我们喝到了五点多，说了很多话，你已经醉了我是看出来了，其实我脑子也有一点不清醒。印象里你还背我了，大力噗吼，第一次身体接触，有点紧张。那天晚上你说了很多胡话，说到你爸妈让你回家，说到打算今年下半年就回西安了，说到自己恋爱经验匮乏，当时的心情是有点小失落，因为如果你要回家的话可能和你在一起也不是什么负责任的事情，而且我自己也要去东京。啊我在想什么，应该说，如果你考虑回去的话，应该就表示在上海没有喜欢的人吧。。所以觉得自己只要继续伪装成gay就好。<br/>11月24日，又是日剧群聚会。你说环球港的栗子的很好吃，就先去买好了再过来。还发生了很尴尬的事情，因为中山公园离环球港很近，所以我买完栗子之后就想骑自行车过来，结果找不到穿过苏州河的桥，硬是在桥下兜了几个来回，后来还是问路之后才找到了方向，所以迟到了一会儿。看到你在门口等我还是很开心的。那一天我们吃到了一点，和村长还有你一起去唱歌了，中间发生的激情男男的事情不想过多的描述，不属于这个网站谢谢。反正大概讲了很多莫名其妙的话，你说想找男朋友想去东京，我说要不跟我一起去东京吧，你说好啊好啊，我也已经分不清是真的假的了，反正听到还蛮开心的。在KTV聊了很多，但是那天我真的是喝多了，所以也记不太清具体的细节了。<br/>在一起之前最后一次见面是在28号，那天也应该不能算是谁约了谁，本来就是说好了要一起去吃栗子，然后你还带我去吃了之前安利了很久的一家烤肉饭。然后我刚才在打这段文字的时候才意识到，从那时候开始你就已经不好好吃饭了，剩了好多在碗里。后来就闲逛嘛，想去吃臭豆腐结果那家店关门了，想去华师大逛时间又太晚了。看到麦当劳新出的蝙蝠侠派，最终我们决定去试一下，正好环球港也有麦当劳。没想到的是，我还带你去我们办公楼参观了一下，其实我觉得已经算是怎么讲比较亲密的行为了吧，毕竟工作还是非常个人的一件事情，但是又很矛盾如果被同事看到了怎么办，我应该怎么解释呢明明不是女朋友。。。所以最后也没让你进来就在门口偷偷观察了一下。然后，辻利抹茶很好喝，之前就有朋友安利过我，也算是拔草了吧。回去你还发了条朋友圈还是微博，说把浪费的人记在小本本上，我内心还是很开心的，一是被你在朋友圈里提到了，然后又能够出现在你的小本本上。<br/>所以，这应该就是我们认识的全过程，我们在一起的铺垫吧。仔细想了想，铺垫还是有不少的，以至于在在一起的那天，一切都进行的很顺利。", margin: t.storyMargins[0], image: t.storyImage[0] } }), t._v(" "), e("Story", { ref: "story2", attrs: { image: "static/test.jpg", title: "幸せ感じる", text: "现在想想，在一起之前我们约的确实非常的频繁啊，除了日剧群聚会大家都去之外，平时周中的周三我们也会见，周五即使没有聚会也要找点事情出来干不是吗。于是在12月1日我们就突发奇想的要一起去吃螺狮粉。嘛因为我没吃过，所以真的蛮期待的，而且自己似乎陷入了一个怪圈，只要你约我出去，不管忙不忙，不过干什么，我好像都是答应的。。。<br/>当然我知道，作为一个女生，尤其是一个没有什么恋爱经验的女生，约男孩子出去是非常害羞的一件事情（这一点之后也和你确认过了），这里确实是我不好，我自己没有主动的原因是，我根本就处于喜欢和暗恋的阶段，因为自己会去日本所以在一起这件事想都不敢想啊。所以我觉得，即使真的很喜欢，也应该要克制住自己的情感。所以好像主动的一方看上去都是你，当然你也有犹豫的时候，就在那天你突然问我下午在不在家然后说自己要去华师大走走233我当时就猜你是不是要约我了，我也想过要不要说我陪你去呗，不过最后在纠结中发现你已经出发了，时间也不早了，这件事就不了了之。</br>回到正题。当天吃的东西也不少，我发现我们每次出去玩，都要吃到吐才肯罢休。我来回忆一下吃了什么：螺师粉，烧饼，啤酒，鱿鱼丝，清酒，日料，烧烤，冰激凌。。。从晚上八点一直吃到凌晨一点，大概这就是真爱吧。</br>可能是因为在日料店喝了点酒的缘故，大家之后走路都很嗨（无奈这个店10.30就关门了，只能换场子），边走还边唱歌，商量着下一场去哪里。最后选了一个小烧烤店，路边摊，早知道要在这里告白，那就应该选一个有点氛围的地方才对。喝酒，抽烟，挽着手（有点紧张当时，不过不会抗拒的）走在黑路上，然后去烧烤店尬聊，真的是尬聊，两个人疯狂暗示对方，就是不肯先松口，大概内容如下：<br/>“想找个男朋友，想有个寄托，即使说带我去日本也挺好的”<br/>“那找啊，走，跟我去日本”<br/>“我说真的，即使是你也可以”</br>“是嘛，那就跟我去啊，日本可棒”</br>...</br>如此重复N次后，最终还是我先缴械，嘛，大概也能猜到你的心意所以很自然的就在一起啦。路上你问了不知道多少遍真假，当然是真的啊，不然你敲敲自己的脑袋试试（<br/>于是乎，梦幻的一天结束了，在微醺的状态下心头还暖暖的，很是美好了。", margin: t.storyMargins[1], image: t.storyImage[1] } }), t._v(" "), e("Story", { ref: "story3", attrs: { image: "static/test.jpg", title: "食べ食べ食べ食べ", text: "在一起之后我们也保持了每周三一小聚，周末一大聚的良好习惯。周三去吃了我马克很久的酸菜鱼（实际上不酸），怎么讲，感觉自己真的很喜欢吃鱼，好想给你安利的几家店，全都是和鱼相关的：酸菜鱼，烤鱼，椒麻鱼。。。总觉得在一起之后你的食欲就比以前笑了很多嘛，有偶像包袱了吼。味道嘛，就是很常规的酸菜鱼的味道，重点是和谁一起吃了嘛。<br/>12月10日是第一次正式的，在一起之后的约会。第一次选择的地方就有点高端：夏永康摄影展。说实话自己在看展这方面是非常苦手的，因为自己从来没有去过，大学身边都是男生，几个男的去看文艺展总觉的怪怪的。。。所以这一次约会也很期待啊，第一次以情侣的身份出去，又能够尝试一下自己没有试过的，想想就觉得很兴奋。<br/>这里我就不得不提到我们当时一起选的餐厅：星洲小馆。嘛，东南亚菜，其实一开始我觉得会不太合我的口味，因为我去过泰国之后，对东南亚菜有一种自然而然的厌恶感，可能是罗勒草给我留下了巨大了阴影。不过这家店又颠覆了我的看法，那个米饭都是带味道的，也太好吃了吧。。。海南鸡，那个汤叫啥我也忘了，还有甜点，都很棒，除了座位有点小衣服不好放之外，找不到其他的缺点了。<br/>因为会场靠近滨江，所以还是有一丝寒意的。到了会场内发现大部分都是女孩子来看，还有一些看上去gaygay的男孩子（我应该不算吧）。会场不大，但是因为有好几个房间，长得都很类似，所以很容易就错过一些东西。印象比较深刻的，是一张拍黄伟文的照片，这也是你最喜欢的词手。另外一张就是抱着鸡的松田老板了哈哈哈。<br/>周围还有很多会展的小馆，可能都是一些不太知名的艺术家，顿时感觉自己非常的无知与欣赏不来。有一个馆好像展出的是一些布，从残缺不齐到完整无暇，丝毫让人不能抓住重点。嘛，反正是和你在一起，所以看什么都很开心（尤其是拍照被表扬的时候）", margin: t.storyMargins[2], image: t.storyImage[2] } }), t._v(" "), e("Story", { ref: "story4", attrs: { image: "static/test.jpg", title: "部屋の準備", text: "又到了一个周末，这周末决定去拔草之前给你知乎上看的几家面包店，下午的话就去宜家玩～（撸狗计划泡汤，因为时间不够了）。<br/>面包店在徐汇区，叫avec toi。名字看上去还挺文艺的，店面不大，但是很温馨，进去的时候只有一个高中生在角落里写作业。我记得我们点了法棍和羊角面包，味道确实很不错啊，感觉和我之前随便为了填饱肚子而吃的面包有很大的不同。。果然高端的东西味道就是好。最后东西没吃完，打包就带走了～<br/>下午计划是要去逛宜家。其实说实话我之前从来没有去过宜家，但是在muji里面看到这种很干净很整齐，又有一点暖色调的氛围，就会很想买房子然后构建自己的家。想到这个就会想一些有的没的毕竟是和女朋友一起去嘛。过去的时候正好是中午，体会了一把宜家的餐厅，之前就说宜家的餐厅很好吃然后外面的大叔大妈中午都会来吃饭。可能是人太多了，给我有一种大食堂的感觉，所以也没有很仔细的挑选自己要吃什么，就随便拿了一点吃的。味道好像也没有我想象中的那么好。不过进去之后确实是很震撼，特别是那种小洋房，看上去就很有居住欲。而且原本以为这种宜家大品牌的东西都很贵，没想到里面有很多平价的东西（虽然最后也什么都没买，除了吃的）。我们两到是把两层楼都逛了个遍，指指点点，选选自己喜欢的布置，很像要新装修的夫妇嘛。<br/>逛完宜家。。两个吃货果然想去哪里坐一会吃点东西，因为我晚上还要去爷爷家吃饭，所以不能呆很久。最终选定到日式拉面馆，估计服务员也很震惊，这两个人来了之后面也不点，点了两杯生啤大白天的就开始喝酒。。。不过嘛，和你喝酒总是很开心的，总觉得我们的在一起是离不开酒的，有一点酒精驱动，大家说话就更加直接了点，平时憋着的话也能够倾诉出来。所以感觉酒就是我们的幸运物哈哈。<br/>好像就是这一次约会，我们商量了一下跨年的计划，最终为跨年大型醉酒演出奠定了基础。", margin: t.storyMargins[3], image: t.storyImage[3] } }), t._v(" "), e("Story", { ref: "story5", attrs: { image: "static/test.jpg", title: "明けまして", text: "这个说到新年啊，可以聊的事情就多了，怎么样有没有瑟瑟发抖哈哈哈。<br/>不过在此之前呢，我们先一起过了一个圣诞节，没记错的话应该是个周一，然后你来环球港陪我拔草麻省理功烤鱼，其实这家店我想吃很久了，因为他的名字嘛，世界名校，应该算是每一个CS学子的梦想，所以就想去尝尝味道。其实一直在想要不要给你带礼物，正好昨天看到朋友圈有人在说Godiva有圣诞节限定，然后巧克力嘛也是情人间常送礼物的配置，所以就想去专卖店看一下（说实话我之前除了女朋友要求之外好像就没有在圣诞节送过礼物，emmm自己对节日本身观念就比较单薄）。看到了一款很可爱很小巧的巧克力，就买下来给你了。嘻嘻之前也没有跟你说，希望你看到之后会很开心（事实反应好像比我想象的小了一点嗯）。整个吃饭的过程还是很和谐的，就是这家店烤鱼是几条小的，莫名其妙，好吃是好吃，就是不够爽。。。<br/>然后就是跨年了。之前你好像一直都很抗拒和我过夜的样子，但是在我的旁（qiang）敲（lie）侧（qiao）击（qiu）下，你终于答应要和我一起住民宿啦！可能是因为你想看小丑回魂，想看我跳恋舞然后做蛋炒饭吧hhhh我们去的很早，中午就到了，小姐姐人也很好，房子也很干净很香。下午当然是先去超市采购了一波，两个酒鬼真的是没救了，买了两听啤酒一瓶江小白一瓶伏特加，晚上还添置了两瓶梅酒。下午就在客厅里看成人高校剧场版，晚上本来说是要吃什么海底捞，什么火锅的，结果太懒了就直接在家里点了披萨233蛮好的，多和你待一会儿嘛。<br/>之前因为我订好了爵士乐的门票，所以当天晚上七点我们还出发进城了。人山人海，而且这个草根乐队的演出。。。实在是不想评价了。唯一比较有意思的是看到了品种很多的日本酒，每个都想尝尝。和你走在上海的街头，等待2018年的到来，真的很美好呢。<br/>回到民宿后那叫一个精彩，那叫一个绝伦。我们开始看小丑回魂，边看边做羞羞的事情你懂的，然后。。就开始。。喝了起来。。一开始喝喝啤酒喝喝梅酒还蛮好的，直到我们干起了伏特加。。崩了，你怎么当白开水喝啊，直接就滚倒在地上了，我也不好，一直让你继续喝，于是两个人在12点干了一整瓶伏特加，拉满了，你走都走不动都是我拖你的，好不容易把你抗上床，你要尿尿。尿吧，还锁门，担心死了，嘴里还说着sorry。。。哈哈哈真的很可爱了啦。不过第二天醒来你的状态还是不太好，总觉得你是不是有点酒精中毒了。。。这次之后就还是少喝点吧。同时我们需要感谢开杯乐，拯救你的胃于水深火热之中。<br/>还有一个小插曲，我们用了房东的所有的浴巾，实际上要消费的，但是最后和房东沟通下来后还是没有让我们掏钱，感动。<br/>跨年第二天我们一起去吃了海底捞，因为正好是我们一个月的纪念日，所以要庆祝一下。你好像在那时候才反应过来当天晚上我们做了些什么，其实没关系的啦，都是成年人了。而且也没有很丢人啊，在喜欢的人眼里什么都很可爱！", margin: t.storyMargins[4], image: t.storyImage[4] } }), t._v(" "), e("Story", { ref: "story6", attrs: { image: "static/test.jpg", title: "三月の猫", text: "我们这个搭配也是比较奇葩的，我更喜欢猫，你更喜欢狗。其实狗子我也喜欢，他们看上去都很可爱嘛，可爱的东西都很讨人喜欢。所以我们一直在约去撸狗子，第一次提起应该是在吃完辣府之后，你说周末的时候去撸狗子吧。嘛，当时其实没有特别放在心上，你可能只是处于礼仪性的一提嘛，但是内心还是有点期待的（结果不出所料那个周末你果然没有提起这件事）。<br/>之后在一起了，终于可以光明正大的撸狗子啦！上海其实这种撸狗的地方不多，可能是因为狗比较吵闹身上也有味道吧。。。最终好不容易找到在虹口区的一家，过去之后发现老远就能问道一股味道，进去之后已经没有位置可以坐了，就看到几只汪汪有的趴在地上有的窜来窜去。后来你也放弃了，可能也是受不了这种味道吧。嘛没事，以后我们自己养就可以了嘛！放弃狗子后就去吃了种草很久的椒羞，四川串串，辣的东西吃起来就是很幸福嘛，而且正好可以打六折，还是很划算的！<br/>既然没有办法去撸狗，那我们就去撸猫嘛，上海这种店还是有特别特别多的。你给我安利了一下三月咖啡厅，离13号线很近。过去的时候找了一会儿，因为门面还是比较小的，但是！进去之后！真的很有咖啡馆的那种文艺的气息。因为提前预约过了，所以店家给我们保留了一个沙发位，我们这次终于成功顺利的把小丑回魂给看完了，开心。店里面有两只猫，好像猫猫都比较喜欢你，往你身上蹭，可是明明我更喜欢猫啊QWQ，为什么会这样。说实话之前都是云撸猫，都没有实际的去摸过，所以第一次摸到猫有点怕怕，摸多了就好啦。猫猫真的很可爱啊，摸他的头会发出咕咕咕的声音，表示自己很舒服，还会踩奶！虽然好像踩错了部位。感觉你把猫撸的好爽啊，他眼睛都睁不开了233拍了好多照片，那个猫的脸蛋就像是纵欲过度了一样笑死我了，然后你撸猫的姿态我连拍了好几张，就像你说的一样是一个太妃在拨弄自己的玩宠一样。不过猫和你还是你更可爱一些ww晚饭我们也在那家咖啡馆吃的，有趣的人才会发现这么棒的地方，以后还要多多挖掘你！<br/>回去的时候还发生了一些小插曲哈哈，你的袖口的带子掉了，之前好像就掉过一次然后让他们重新配了一根，所以不想再丢了。我们沿路回去找，虽然说多走了几步路，但是在这种昏暗的小路上就我们两个边走边聊天，感觉好棒啊～而且最终带子也找到了，充实的一天！", margin: t.storyMargins[5], image: t.storyImage[5] } }), t._v(" "), e("Story", { ref: "story7", attrs: { image: "static/test.jpg", title: "こちゃんとエリナ", text: "又到了周五，到了例行约会的时候了，本来说我们要去Speak Low的，因为之前一直在给你安利，又不放心你一个人去喝酒嘛。结果，结果敏哥在群里发了自己家狗狗的照片，完了，没有撸到过狗的我们两已经按捺不住自己的心情了。。。问了一下敏哥周五能不能来撸狗，敏哥爽快的答应了，而且他妈妈出差了嘛，所以家里就他一个人。当然我们不能空手去啦，买了点栗子，买了几盒熟食和一拼梅酒就去啦。<br/>敏哥家地段还是好，长宁区，水城路，周围好多日料店和日系商品店，对于我们这种喜欢吃日料的人来说简直就是天堂。还没进敏哥家呢，在门口拖鞋就听到两只狗狗的叫声，都快冲出来了，看来还没有丧失狗狗的本能，对于陌生人还是会有警惕的嘛。敏哥的两只狗狗，一公一母，公的叫抠酱母的叫艾莉娜。抠酱一身雪白，脸很小眼睛圆滚滚的，特别特别的可爱（什么品种我忘了。。。），性格也很活泼，就是愿意给别人摸给别人抱的那种。抠酱还有一个怪癖好就是喜欢舔，什么都舔，抱着他就要开始舔我们的手，舔到舌头都发紫了还要舔。嘛，我有一点点小洁癖所以每次被他舔完都会去洗手。后来我也放弃了，舔吧舔吧让你舔爽了。。。艾莉娜是个女孩子嘛，所以可能比较腼腆害羞一些，一直跟着敏哥不给我们碰。是一只褐色的狗狗，小卷毛，看上去很高贵很优雅的那种。敏哥说艾莉娜是被他在悬崖上救下来的，所以特别特别的亲他，这也到可以理解。两只狗狗吃饭的时候还抢，艾莉娜好好的在吃，抠酱就去抢，果然是男孩子老是欺负女生，不乖。还有一件比较有趣的事情就是，我们在吃饭的时候，可能他们都累了，所以在自己的窝里睡着了。我们在观察他们睡觉的姿势的时候，喊了一声“抠酱”，然后他就蹭的一下子站了起来，腾腾腾的跑过来就要抱抱要舔舔，真的是太可爱啦。<br/>敏哥的厨艺自然不用多说，满满一桌子的菜我们都吃完了。期间还讨论了很多的人生问题，包括语言学校啊买房啊什么的，不过我们还小啦不用思考这么多，你也不要有压力哦。（这里就不多说了，因为和文章也没啥关系）<br/>走的时候，抠酱和艾莉娜又嗷嗷叫个不停，这次应该是舍不得才叫的吧。<br/>其实，今天，除了在敏哥家做客以外，我还去了你家做客呢哈哈哈。小房间打理的还是很温馨嘛，不过就像你说的那样，房子整体上而言还是有点破旧的，所以也可以理解你要换房子啦。（说实话我现在房间的布置和家具很多都是借鉴你的）", margin: t.storyMargins[6], image: t.storyImage[6] } }), t._v(" "), e("Story", { ref: "story8", attrs: { image: "static/test.jpg", title: "送別会", text: "这周应该是我在中国的倒数第二个周末了。说来我们是怎么认识的，其实还是要感谢村长创建的日剧群，至少让我们有了相处接触的机会对吧。从大群中又衍生出了一个小群，这个小群由十多个比较活跃的成员组成，我们也在其中。因为我要走了嘛，所以大家就想给我举办一个欢送会，时间呢就定在这周的周六了。<br/>周五我们约了一起去拔草一家网红面包店SunFlour，在徐汇区。我比较蠢，因为没有吃晚饭，所以就点了好多粗粮啊，感觉店家和你都要嘲笑我了，明明是第二天拿回家吃的东西却在店里当晚饭吃。。。不过有一句说一句，这家店的面包确实特别好吃，有名的作坊还是不一样呀。吃完面包原本是我很期待的终于要带你去speak low了，结果，结果，因为是周五，然后去的时候时间也有点晚了，所以根本没有位置还要排队。。随便一问就说要一个多小时，绝望，不想排队但是有不想和你分开，该怎么办呢，也想找个地方坐一会儿。想了半天最后决定去唱歌吧，就做十三号线到金运路。结果那个乡下的KTV也满人，等了半小时都还没轮到，实在是不想等下去了，就走了。<br/>走了之后去干吗呢是个问题，两个人都不想分开，也想找个地方坐坐。显然嘛你家！可是你好像不太乐意的样子，也不知道为什么。。。最后使用了，我就蹭蹭不进去法，成功的从送你到楼下，然后送你上楼，然后太黑进去喝杯咖啡吧，然后我就喝完这杯水就走，然后再抱一下就走，到最后“不想让你走了”哈哈哈成功的留了下来。其实也蛮好的嘛，我以后想去都去不了了，珍惜这最后的几夜嘛。<br/>第二天你要先去报名教师资格证考试，然后晚上一起去参加送别会。这应该也是我和大家的最后一次见面了吧。店的环境也还不错，来的人也挺多的，东西也很好吃，唯一比较可惜的是没有坐在一起。。。不过这也无所谓啦，大家都是成年人，不用太在意这些。今天不知道怎么了，敏哥状态不太好，可能是因为出差刚回来太累了吧。值得一提是，松田老板带来的蛋糕味道还不错www<br/>没想到这一次聚会结束的这么快，这也就意味着我们见一次少一次了。要是我在上海也是自己住该有多好，那样我们可以天天在一起了，也不用看大人了脸色了。。。", margin: t.storyMargins[7], image: t.storyImage[7] } }), t._v(" "), e("Story", { ref: "story9", attrs: { image: "static/test.jpg", title: "パジャマ", text: "最后一个周末，说好了要去你家里的，所以周五早早地下班就来啦。而且是第一次去你新家，开心！激动！<br/>下班接到你之后，先去中环的超市那里去买点东西，因为要给你做蛋炒饭，所以这一次就可以买很多鸡蛋了！还买了几听可乐和三瓶啤酒，虽然最后都没喝。我一直觉得最后一周简直就是毁了我在你心中的形象，先是回去的路上不小心把鸡蛋给打碎了，然后洗澡的时候你的浴盆也不当心被我打翻了掉了下来，感觉自己好蠢，所幸的是你一直都没有嫌弃我。。。你真是的太好了。<br/>其实这一天晚上发生了很多事情，穿好睡衣之后大家似乎都比较困不想做别的事，于是我们就去床上呆着了。一开始还好好的嘛，大家就聊聊天，玩玩手机，一会儿就睡了。后来不知道怎么了就发生了那种事情关键是还没有避孕措施。。其实我觉得这一条还蛮渣的没有控制住自己，事后想想觉得没有措施的时候是绝对不能发生那种事的。。。果然下次我们见面的时候需要准备一下。<br/>然后，我也不知道这一晚上发生了多少次（捂脸）总觉得早上醒来的时候累累的，关键是正事还一件没干了，还没帮你拿快递，没做蛋炒饭也没有帮你装杆子。然后这些事情从第二天早上十点开始要一件一件慢慢做了。你的快递还真的是多，最后我在大雪之中用一个超大麻袋把他们都抗了回来，突然觉得自己还是有点用的，虽然很累但是也很开心。关于蛋炒饭，因为自己很久没有做过了，所以功力有所下降，没有咸味。最后是在炒蛋的时候加入了一点酱油才挽回了一点整道菜。现在我不一样了，已经有所进步，所以你来之后已经要给你尝尝。<br/>最难的一个任务就是给你装杆子，首先杆子要装在室外，然后这个窗户是只能打开一半的，我婶子都探不出去。还有就是，杆子的一头是直接套在上面的，并没有固定，很容易一不小心就掉下去。试想一下在大雪之中，下楼跑到草丛里找一个旋钮。。。太可怕了，所以对我来说，这件事情要一次性搞定。大概尝试了半小时多吧，期间扭扭捏捏想了好几种不同的方案，最后终于成功了！就是还有一些瑕疵，杆子没有放平，然后离窗户太近了。下雨天的话窗户会很脏，然后衣服贴在窗户上就更脏了，所以让你买一个那种号清晰的透明窗贴，能够解决一部分的问题。如果实在不行的话，下次等我回国再帮你想办法。<br/>三点多的时候，必须回家了。你送我到楼下，外面还继续飘着雪，不知道你是什么样的心情。怕自己犹豫不决又亲又抱，外面又特别冷，所以这一次走的还是比较坚决的，也不敢回头看你在干嘛。希望在东京见到你的时候，还是那一只可爱的猪猪。", margin: t.storyMargins[8], image: t.storyImage[8] } })], 1)
                },
                staticRenderFns: []
            };
        var m = e("VU/8")(p, d, !1, function(t) { e("GIxI") }, null, null).exports,
            y = e("VN6J"),
            u = e("ZErk");
        s.a.use(u.a, {}), s.a.use(y.a), s.a.config.productionTip = !1, new s.a({ el: "#app", components: { App: m }, template: "<App/>" })
    },
    Oa4U: function(t, i) {},
    mdgl: function(t, i) {},
    uLOi: function(t, i) {}
}, ["NHnr"]);
//# sourceMappingURL=app.f070af3cc2a469cda272.js.map