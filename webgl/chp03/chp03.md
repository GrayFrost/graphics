# 绘制和变换三角形

## 画单个点
上一章画单个点的流程：获取canvas元素 -> 获取WebGL绘图上下文 -> 初始化着色器 -> 设置canvas背景色 -> 清除之前的绘图内容 -> 绘图。


我们回顾下这个流程：
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

## 画多个点
画多个点多了一个步骤：  
获取canvas元素 -> 获取WebGL绘图上下文 -> 初始化着色器 -> **设置点的坐标信息** -> 设置canvas背景色 -> 清除之前的绘图内容 -> 绘图。  

**设置点的坐标信息**的详细流程：
创建缓冲区 -> 将缓冲区绑定到目标 -> 向缓冲区写入数据 -> 将缓冲区对象分配给attribute变量 -> 启动缓冲区对象与attribute变量的连接。

```javascript
// gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.0); //将上一章中的只画一个点的操作注释

// 准备好点数据
let vetices = new Float32Array([
	-0.5, 0, 0.5, 0, 0, 0.5
]);

// 创建缓冲区
const vertexBuffer = gl.createBuffer();
// 绑定缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// 向缓冲区传准备好的数据
gl.bufferData(gl.ARRAY_BUFFER, vetices, gl.STATIC_DRAW);
// 参数意义
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_Position);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.POINTS, 0, 3); // 将1改成3，表示要画三个点。
```

gl.bindBuffer
gl.bufferData
gl.vertexAttribPointer
gl.enableVertexAttribArray
参数意义


创建多个buffer？
varying 传值

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