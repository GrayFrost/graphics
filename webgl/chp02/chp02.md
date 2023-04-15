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


## 参考
* [WebGL Programming Guide](https://sites.google.com/site/webglbook/home)