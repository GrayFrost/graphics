let VSHADER_SOURCE = /* glsl */ `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
`;

let FSHADER_SOURCE = /* glsl */ `
  #ifdef GL_ES
  precision mediump float; // 精度限制
  #endif
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  varying vec2 v_TexCoord;
  void main() {
    vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
    vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
    gl_FragColor = color0 * color1;
  }
`;

function main() {
  const canvas = document.getElementById("webgl");
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  let n = initVertexBuffers(gl);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.drawArrays(gl.POINTS, 0, n);
  if (!initTextures(gl, n)) {
    console.log("Failed to initialize texture.");
  }
}

function initVertexBuffers(gl) {
  const verticesTexCoords = new Float32Array([
    -0.5, 0.5, 0, 1.0, -0.5, -0.5, 0, 0, 0.5, 0.5, 1.0, 1.0, 0.5, -0.5, 1.0, 0,
  ]);
  let n = 4;
  let vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);
  return n;
}

function initTextures(gl, n) {
  // 创建纹理对象
  let texture0 = gl.createTexture();
  let texture1 = gl.createTexture();
  // 获取u_Sampler的存储位置
  let u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  let u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");

  // 创建image对象
  let image0 = new Image();
  image0.onload = function () {
    loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
  };

  image0.src = "../../images/sky.jpg";

  let image1 = new Image();
  image1.onload = function () {
    loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
  };
  image1.src = "../../images/circle.gif";
  return true;
}

let g_texUnit0 = false;
let g_texUnit1 = false;
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 对纹理图像进行Y轴反转
  if (texUnit == 0) {
    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } else {
    // 开启1号纹理单元
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  }

  // 向target绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // 配置纹理对象
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // 将0号纹理传递给着色器
  gl.uniform1i(u_Sampler, texUnit);
  gl.clear(gl.COLOR_BUFFER_BIT);
  if (g_texUnit0 && g_texUnit1) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // 绘制矩形
  }
}
