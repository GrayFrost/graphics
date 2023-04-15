# WebGL入门

首先我们先写一个最简单的WebGL入门程序，然后逐行解释。
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clear Canvas</title>
</head>
<body onload="main()">
  <canvas id="webgl" width="400" height="400">
    Please use the browser supporting "canvas"
  </canvas>
  <script src="../lib/webgl-utils.js"></script>
  <script src="../lib/webgl-debug.js"></script>
  <script src="../lib/cuon-utils.js"></script>

  <script src="HelloCanvas.js"></script>
</body>
</html>
```
```javascript
// Hello
```

我们在html页面中引入了一些封装好的方法（如果你也想下载，[参考这里](https://sites.google.com/site/webglbook/home/chapter-2)），目前我们只需关注`cuon-utils.js`里面的东西，里面是对一些渲染流程步骤的封装，待会讲解。

`gl.clearColor()`用来设置canvas的背景色，不知道有没有和我一样被方法名迷惑了，简单把它当做是`setBackgroundColor`即可。
```
// gl.clearColor(red, green, blue, alpha)
```

```
gl.clear() // 用设置好的背景色填充绘图区域，擦除之前已经绘制的内容，接收三个参数分别是：
gl.COLOR_BUFFER_BIT 颜色缓冲区
gl.DEPTH_BUFFER_BIT 深度缓冲区
gl.STENCIL_BUFFER_BIT 模板缓冲区
```

shader编写
如果你是在vscode中编写shader的代码，推荐装插件`Comment tagged templates`
顶点着色器（Vertex shader）
片元着色器（Fragment shader）


流程
获取canvas元素 -> 获取WebGL绘图上下文 -> 初始化着色器 -> 设置canvas背景色 -> 清除之前的绘图内容 -> 绘图。

齐次坐标齐次坐标使用如下的符号描述：(x,y,z,w)。齐次坐标(x,y,z,w)等价于三维坐标(x/w,y/w,z/w)。所以如果齐次坐标的第四个分量是1，我们可以将它当做三维坐标使用。

gl.drawArrays()
```
gl.drawArrays(mode, first, count)
mode表示指定的方式，可接收如下常量：gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN

first 表示从那个顶点开始绘制
count标志绘制需要多少个顶点
```

WebGL中的坐标系
canvas的中心点：(0.0, 0.0, 0.0)
canvas的上边缘和下边缘：(-1.0, 0.0, 0.0) 和 (1.0, 0.0, 0.0)
canvas的左边缘和右边缘：(0.0, -1.0, 0.0) 和 (0.0, 1.0, 0.0)




## 参考
* [WebGL Programming Guide](https://sites.google.com/site/webglbook/home)