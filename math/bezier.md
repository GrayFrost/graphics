# 贝塞尔曲线

贝塞尔曲线最早是由贝塞尔在1962年提出来的，目的是获取汽车的外形

计算圆的面积时，我们会使用多边形来逼近圆的曲线；贝塞尔曲线刚好相反，它是 **使用曲线来逼近多边形** ，刚好反着来了


计算机图形学中贝赛尔曲线的运用很广泛，例如Photoshop中的钢笔效果，Flash5的贝塞尔曲线工具，在软件GUI开发中一般也会提供对应的方法来实现贝赛尔曲线，我们熟知的CSS动画过渡时间函数也是通过贝塞尔曲线（三阶贝塞尔曲线）获取的


贝塞尔曲线的定义，配图

图


一般在工程中，我们使用**德卡斯特里奥算法（de Casteljau)** 来构造贝塞尔曲线

最常见的贝塞尔曲线动画演示图


**德卡斯特里奥算法（de Casteljau)** 的意义就是满足

$$
\frac{P_0Q_0}{P_0P_1} =  \frac{P_1Q_1}{P_1P_2}  =  \frac{Q_0B}{Q_0Q_1} = t
$$

 的情况下，随着 t 从 0 到 1 逐渐变大，B点经过的点组成的曲线就是我们需要的贝塞尔曲线了。


一次贝塞尔 两个点

二次贝塞尔 三个点

三次贝塞尔 四个点


三次贝塞尔曲线有4个控制点，上图各个点的关系如下：

* A 点是 P0到 P1的一次贝塞尔曲线，B 点是 P1到 P2的一次贝塞尔曲线，C 点是 P2到 P3的一次贝塞尔曲线；
* D 点是 A 点到 B 点的一次贝塞尔曲线（也是 P0，P1和 P2的二次贝塞尔曲线），E 点是 B 点到 C 点的一次贝塞尔曲线（也是 P1，P2到 P3的二次贝塞尔曲线）；
* P 点是 D 点到 E 点的一次贝塞尔曲线，也是 A ,B 和 C 的二次贝塞尔曲线，进而就是 P0，P1，P2和 P3的三次贝塞尔曲线了。


css动画中的animation-timing-function **三次贝塞尔曲线缓动函数**

```text
animation-timing-function: ease;  // 动画以低速开始，然后加快，在结束前变慢
animation-timing-function: ease-in;  // 动画以低速开始
animation-timing-function: ease-out; // 动画以低速结束
animation-timing-function: ease-in-out; // 动画以低速开始和结束
animation-timing-function: linear; // 匀速，动画从头到尾的速度是相同的
```


网站 https://cubic-bezier.com/#.25,.1,.25,1

http://blogs.sitepointstatic.com/examples/tech/canvas-curves/quadratic-curve.html
