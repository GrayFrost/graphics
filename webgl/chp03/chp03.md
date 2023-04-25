# 绘制和变换三角形
上一章的流程：获取canvas元素 -> 获取WebGL绘图上下文 -> 初始化着色器 -> 设置canvas背景色 -> 清除之前的绘图内容 -> 绘图

这次多了一个步骤：
获取canvas元素 -> 获取WebGL绘图上下文 -> 初始化着色器 -> 设置点的坐标信息 -> 设置canvas背景色 -> 清除之前的绘图内容 -> 绘图

在开始之前，我们回顾下上一章简单的画一个点的流程：
```javascript
// 第一步：获取webgl上下文
let canvas = document.querySelector('#webgl');
let gl = canvas.getContext('webgl');

// 第二步：编写着色器代码
// 顶点着色器
const VSHADER = /* glsl */`
	attribute vec4 a_Position;
	void main() {
		gl_Position = a_Position;
		gl_PointSize = 10.0;
	}
`;
// 片元着色器
const FSHADER = /* glsl */`
	void main() {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
`;

// 第三步：创建着色器
const vShader = gl.createShader(gl.VERTEX_SHADER);
const fShader = gl.createShader(gl.FRAGMENT_SHADER);

// 第四步：初始化着色器
gl.shaderSource(vShader, VSHADER);
gl.shaderSource(fShader, FSHADER);

// 第五步：编译着色器
gl.compileShader(vShader);
gl.compileShader(fShader);

// 第六步：创建程序
let program = gl.createProgram();

// 第七步：绑定着色器到程序
gl.attachShader(program, vShader);
gl.attachShader(program, fShader);

// 第八步：连接程序到上下文
gl.linkProgram(program);

// 第九步：启用程序
gl.useProgram(program);

// 第十步：向着色器传值
let a_Position = gl.getAttribLocation(program, 'a_Position');
gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.0);

// 第十一步：绘图
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.POINTS, 0, 1);
```

设置点的坐标信息的详细流程：
创建缓冲区 -> 将缓冲区绑定到目标 -> 向缓冲区写入数据 -> 将缓冲区对象分配给attribute变量 -> 启动缓冲区对象与attribute变量的连接。

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