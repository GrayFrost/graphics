# WebGL入门

## 画点
首先我们先写一个最简单的WebGL入门程序，然后逐行解释。
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Colored Point</title>
</head>
<body onload="main()">
  <canvas id="webgl" width="400" height="400">
    Please use the browser supporting "canvas"
  </canvas>
  <script src="../lib/webgl-utils.js"></script>
  <script src="../lib/webgl-debug.js"></script>
  <script src="../lib/cuon-utils.js"></script>

  <script src="ColoredPoints.js"></script>
</body>
</html>
```
我们可以看到，除了最底下的我们自定义的js文件，还引入了三个工具函数文件。里面是一些封装好的方法（如果你也想下载，[参考这里](https://sites.google.com/site/webglbook/home/chapter-2)），目前我们只需关注`cuon-utils.js`里面的东西，里面是对一些渲染流程步骤的封装，待会讲解。

```javascript
// ColoredPoints.js
// 顶点着色器
let VSHADER_SOURCE = /* glsl */ `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
  }
`

// 片元着色器
let FSHADER_SOURCE = /* glsl */`
  precision mediump float; // 精度限制
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`

function main() {
  const canvas = document.getElementById('webgl');
  const gl = getWebGLContext(canvas); // 获取webgl上下文
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) { // 创建shader
    console.log('Failed to initialize shaders.');
    return;
  }
  // 向顶点着色器中的变量传值
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  // 向片元着色器中的变量传值
  let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get u_FragColor variable');
    return;
  }
  canvas.onmousedown = function(ev) {
    click(ev, gl, canvas, a_Position, u_FragColor);
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // 设置背景颜色
  gl.clear(gl.COLOR_BUFFER_BIT); // 绘制背景

}

var g_points = [];
var g_colors = [];
// 点击后绘制点
function click(ev, gl, canvas, a_Position, u_FragColor) {
  let x = ev.clientX;
  let y = ev.clientY;
  let rect = ev.target.getBoundingClientRect();

  // 将点的坐标从浏览器坐标转换成webgl坐标
  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = ((canvas.height / 2) - (y - rect.top)) / (canvas.height / 2);
  g_points.push([x, y]);

  if (x >= 0.0 && y >= 0.0) {// 在不同象限显示不同颜色
    g_colors.push([1.0, 0.0, 0.0, 1.0]);
  } else if (x < 0.0 && y < 0.0) {
    g_colors.push([0.0, 1.0, 0.0, 1.0]);
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0]);
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for(var i = 0; i < len; i++) {
    let xy = g_points[i];
    let rgba = g_colors[i];
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);//给shader中的变量赋值
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);//给shader中的变量赋值
    gl.drawArrays(gl.POINTS, 0, 1);// 执行绘制的方法
  }
}
```

现在你已经大致看过了上述代码，我们来一起走一遍流程。首先是执行`body`标签中`onload`的`main()`方法。然后我们会获取webgl的上下文，`getWebGLConetext()`是`cuon-utils.js`中封装的方法，之后我们会创建着色器，和gl上下文绑定。之后我们需要调用api`getAttribLocation()`或`getUniformLocation()`拿到在`shader`中设置的变量，为之后的点击事件做准备。之后是正常流程中的`clearColor()`设置背景颜色和`clear()`清除之前的绘制，绘制新画面。另外，我们给canvas绑定了一个点击事件，在点击时，拿到我们当前点击的坐标，然后转换成webgl坐标，经过自定义的颜色逻辑，把坐标数据和颜色数据传入之前获取到的变量里，最后调用`drawArrays()`来绘制出点击的点。

接下来，我们进入到`cuon-utils.js`中分析我们用到的两个方法`getWebGLContentx()`和`initShaders()`。
```javascript
// getWebGLContext()分析
// 我们在cuton-utils.js中找到getWebGLContext，然后经过重重方法的调用，找到了最本质的逻辑
var create3DContext = function(canvas, opt_attribs) {
  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  var context = null;
  for (var ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(names[ii], opt_attribs);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  return context;
}
```
和明显，主要就是在创建webgl上下文时，做浏览器的兼容。

```javascript
// initShaders()分析
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

function createProgram(gl, vshader, fshader) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

function loadShader(gl, type, source) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
```
我们来分析一下在webgl中如何创建shader。主要步骤如下：
* 创建webgl上下文
* `gl.createShader(type)`创建一个shader
* `gl.shaderSource(shader, source)`绑定我们写好的shader代码，`source`即是我们写好的代码，在javascript中shader代码以字符串形式编写。
* `gl.compileShader(shader)`编译执行shader
* `gl.createProgram()`创建program，整个着色器的渲染都与这个`program`绑定
* `gl.attachShader(program, shader)`把前面步骤创建好的shader绑定到`program`上
* `gl.linkProgram(program)`绑定这个`program`到webgl上下文
* `gl.useProgram(program)`启动这个`program`

总结一下，目前绘图的流程如下：
获取canvas元素 -> 获取WebGL绘图上下文 -> 初始化着色器 -> 设置canvas背景色 -> 清除之前的绘图内容 -> 绘图。

## api
在上述例子中，还涉及到一些webgl的api，简单介绍
### clearColor()
`gl.clearColor()`用来设置canvas的背景色，不知道有没有和我一样被方法名迷惑了，简单把它当做是`setBackgroundColor`即可。
```javascript
gl.clearColor(red, green, blue, alpha)
```

### clear()
```javascript
gl.clear() // 用设置好的背景色填充绘图区域，擦除之前已经绘制的内容，接收三个参数分别是：
gl.COLOR_BUFFER_BIT 颜色缓冲区
gl.DEPTH_BUFFER_BIT 深度缓冲区
gl.STENCIL_BUFFER_BIT 模板缓冲区
```

### drawArrays()
```javascript
gl.drawArrays(mode, first, count)
// mode表示指定的方式，可接收如下常量：gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN
// first 表示从那个顶点开始绘制
// count标志绘制需要多少个顶点
```

## shader编写
如果你是在vscode中编写shader的代码，推荐装插件`Comment tagged templates`。然后我们在编写的字符串的前面添加注释，编辑器便能按照对应语言高亮。  
例如：
```javascript
let VSHADER_SOURCE = /* glsl */ `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
  }
`
```
`shader`中文为着色器，分为顶点着色器（Vertex shader）和片元着色器（Fragment shader）。顶点着色器用来处理每个顶点，计算出每个顶点的位置，片元着色器用来对光栅化后的像素进行渲染。


## 齐次坐标
在设置顶点的坐标时，我们例子中是`gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0)`。因为我们目前只演示二维平面，所以最后z轴设置成了0.0。其实，顶点位置的设置有四个参数，里面涉及到了齐次坐标相关的知识。齐次坐标使用如下的符号描述：(x,y,z,w)。齐次坐标(x,y,z,w)等价于三维坐标(x/w,y/w,z/w)。所以如果齐次坐标的第四个分量是1，我们可以将它当做三维坐标使用。


## WebGL中的坐标系
* canvas的中心点：(0.0, 0.0, 0.0)
* canvas的左边缘和右边缘：(-1.0, 0.0, 0.0) 和 (1.0, 0.0, 0.0)
* canvas的上边缘和下边缘：(0.0, -1.0, 0.0) 和 (0.0, 1.0, 0.0)

在上面的代码中，我们有一段逻辑是将浏览器的点击坐标转成webgl的坐标，我们进行分析一下。
```javascript
x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
y = ((canvas.height / 2) - (y - rect.top)) / (canvas.height / 2);
```
首先x是`clientX`，是点击的点在浏览器中的x坐标，`rect.left`是canvas左上顶点距离浏览器的左边距离。  
`(x - rect.left)`即是点击的点在canvas中的坐标。`canvas.width / 2`和`canvas.height / 2`是canvas的中心点的坐标。  
`((x - rect.left) - canvas.width / 2)` 相当于当前的点相对于中心点来说它的坐标是多少，也就是我们把原本canvas左上角的原点转移到了canvas的中心。  
之后除以(canvas.width / 2)相当于把相对的像素值转成0-1的范围，因为webgl的坐标值是`[-1.0, 1.0]`的。  
举个例子，如果我们有一个canvas，长200px，宽200px。我们先假设canvas的左上角即是浏览器视窗的左上角，省去`rect.left`和`rect.top`的逻辑。假如我们刚好点击一个点，这个点的坐标是`[50,50]`。然后我们开始转换逻辑。canvas的中心点是`[100, 100]`。此时点击的点相对canvas来说是`[50 - 100, 100 - 50]`变成`[-50, 50]`，然后转成webgl坐标变成`[-50 / 100, 50 / 100]`即是`[-0.5, 0.5]`。

## 如何在JavaScript和着色器之间传输数据？
`attribute`变量，`uniform`变量。`attribute`变量传输的是那些与顶点相关的数据，而`uniform`变量传输的是那些对于所有顶点都相同（或与顶点无关）的数据。比如每个顶点的位置是不一样的，我们用`attribute`传值，而有时我们需要对这个图像做变换，类似对整个图像进行平移，每个顶点都是平移相同的距离，那我们就用`uniform`变量。  

使用辅助函数initShaders()在WebGL系统中建立了顶点着色器。然后，WebGL会对着色器进行解析，辨识出着色器具有的attribute变量。每个变量都具有一个存储地址，以便通过存储地址向变量传输数据。

```javascript
gl.getAttribLocation(program, name)
// program 指定包含顶点着色器和片元着色器的着色器程序对象
// name 指定想要获取其存储地址的attribute变量的名称
```

```javascript
gl.vertextAttrib3f(location, v0, v1, v2)
// location 指定将要修改的attribute变量的存储位置
// v0, v1, v2 对应坐标值
```
除了`vertextAttrib3f`外，还有
* `vertextAttrib1f(location, v0)`
* `vertextAttrib2f(location, v0, v1)`
* `vertextAttrib4f(location, v0, v1, v2, v3)`

## OpenGL ES 2.0命名规范

gl.{基础函数名}{参数个数}{参数类型}

同样，`gl.uniform4f`也有`uniform1f`，`uniform2f`，`uniform3f`。

## 参考
* [Your First Step with WebGL - WebGL Programming Guide](https://sites.google.com/site/webglbook/home/chapter-2)
* [笛卡尔坐标系](https://zh.wikipedia.org/wiki/%E7%AC%9B%E5%8D%A1%E5%B0%94%E5%9D%90%E6%A0%87%E7%B3%BB)
* [齐次坐标](https://zh.wikipedia.org/zh-hans/%E9%BD%90%E6%AC%A1%E5%9D%90%E6%A0%87)
* [Shaders](https://learnopengl.com/Getting-started/Shaders)