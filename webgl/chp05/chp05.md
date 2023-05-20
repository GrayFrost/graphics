# 颜色与纹理

## 什么是纹理
在三维图形学中，我们通过三角形来构造物体。然而通常我们设置颜色时不可能是简单的给这些物体添加一个固定的颜色值，真实的要求往往是按照现实世界的某个物体来展示。这个时候就需要用图像映射到这个几何物体上去。这张图像便成为**纹理图像**或**纹理**。简单理解就是贴图。组成纹理图像的像素成为**纹素**。

## 在矩形表面上贴上图像
最简单的对纹理的处理主要有以下几个步骤：
* 顶点着色器接收纹理坐标，光栅化后传递给片元着色器
* 片元着色器根据片元的纹理坐标，从纹理图像中抽取出纹理颜色，赋给当前片元
* 设置顶点的纹理坐标
* 准备待加载的纹理图像，用浏览器读取
* 监听纹理图像的加载事件，一旦加载完成，就在WebGL中使用纹理
```javascript
let VSHADER_SOURCE = /* glsl */ `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
`

let FSHADER_SOURCE = /* glsl */`
  #ifdef GL_ES
  precision mediump float; // 精度限制
  #endif
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
  }
`

function main() {
  // 初始化webgl上下文和shader的步骤，代码省略不展示了
  ...
  
  let n = initVertexBuffers(gl)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  if (!initTextures(gl, n)) {
    console.log('Failed to initialize texture.');
  }
}

function initVertexBuffers(gl) {
  // 顶点坐标和纹理坐标
  const verticesTexCoords = new Float32Array([
    -0.5, 0.5, 0, 1.0,
    -0.5, -0.5, 0, 0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5, 1.0, 0,
  ]);
  let n = 4;
  let vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  // a_Position的传值，代码省略不展示了
  ...

  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);
  return n;
}

function initTextures(gl, n) {
  // 创建纹理对象
  let texture = gl.createTexture();
  // 获取u_Sampler的存储位置
  let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

  // 创建image对象
  let image = new Image();
  image.onload = function() {
    loadTexture(gl, n, texture, u_Sampler, image);
    console.log('image loaded');
  }

  image.src = '../../images/sky.jpg';
  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 对纹理图像进行Y轴反转
  // 开启0号纹理单元
  gl.activeTexture(gl.TEXTURE0);
  // 向target绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // 配置纹理对象
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // 将0号纹理传递给着色器
  gl.uniform1i(u_Sampler, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // 绘制矩形
}

```