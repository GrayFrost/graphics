# 绘制和变换三角形
上一章的流程：获取canvas元素 -> 获取WebGL绘图上下文 -> 初始化着色器 -> 设置canvas背景色 -> 清除之前的绘图内容 -> 绘图

这次多了一个步骤：
获取canvas元素 -> 获取WebGL绘图上下文 -> 初始化着色器 -> 设置点的坐标信息 -> 设置canvas背景色 -> 清除之前的绘图内容 -> 绘图


旋转：
三角函数两角和差公式

旋转矩阵：
$$
\left[
\begin{matrix}
	cos\beta & -sin\beta & 0 & 0\\
	sin\beta & cos\beta & 0 & 0 \\
	0 & 0 & 1 & 0 \\
  0 & 0 & 0 & 1
\end{matrix}
\right]
$$



平移矩阵：
$$
\left[
\begin{matrix}
	1 & 0 & 0 & Tx \\
	0 & 1 & 0 & Ty \\
	0 & 0 & 1 & Tz \\
  0 & 0 & 0 & 1
\end{matrix}
\right]
$$

缩放矩阵：
$$
\left[
\begin{matrix}
	Sx & 0 & 0 & 0 \\
	0 & Sy & 0 & 0 \\
	0 & 0 & Sz & 0 \\
  0 & 0 & 0 & 1
\end{matrix}
\right]
$$