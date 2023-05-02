let VSHADER_SOURCE = /* glsl */ `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
    v_Color = a_Color;
  }
`

let FSHADER_SOURCE = /* glsl */`
  precision mediump float; // 精度限制
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`

function main() {
  const canvas = document.getElementById('webgl');
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get u_ViewMatrix variable');
    return;
  }
  let u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if (!u_ProjMatrix) {
    console.log('Failed to get u_ProjMatrix variable');
    return;
  }

  let n = initVertexBuffers(gl);

  // 创建视图矩阵
  let viewMatrix = new Matrix4();
  document.onkeydown = function(ev) {
    keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
  }

  // 创建指定可视空间的矩阵并传给u_ProjMatrix变量
  let projMatrix = new Matrix4();
  // projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);
  projMatrix.setOrtho(-0.5, 0.5, -0.5, 0.5, 0.0, 0.5);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  draw(gl, n, u_ViewMatrix, viewMatrix);

}

function initVertexBuffers(gl) {
  const verticesColors = new Float32Array([
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

    0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ]);
  let n = 9;
  let vertexColorsBuffer = gl.createBuffer();
  if (!vertexColorsBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);
  return n;
}

let g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; // 视点
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
  if (ev.keyCode == 39) {
    g_eyeX += 0.01;
  } else if (ev.keyCode == 37) {
    g_eyeX -= 0.01;
  } else {return;}
  draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
  // 设置视点和视线
  viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

  // 将视图矩阵传递给u_ViewMatrix变量
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}