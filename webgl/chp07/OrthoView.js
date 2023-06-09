let VSHADER_SOURCE = /* glsl */ `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ProjMatrix * a_Position;
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
  const nf = document.getElementById('nearFar');
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  let u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if (!u_ProjMatrix) {
    console.log('Failed to get u_ProjMatrix variable');
    return;
  }

  let n = initVertexBuffers(gl);

  // webgl中矩阵是列主序
  let projMatrix = new Matrix4();
  document.onkeydown = function(ev) {
    keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf);
  }

  draw(gl, n, u_ProjMatrix, projMatrix, nf);

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

// 视点与近、远裁剪面的距离
var g_near = 0.0, g_far = 0.5;
function keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf) {
  switch(ev.keyCode) {
    case 39: g_near += 0.01; break;
    case 37: g_near -= 0.01; break;
    case 38: g_far += 0.01; break;
    case 40: g_far -= 0.01; break;
    default: return;
  }
  draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

function draw(gl, n, u_ProjMatrix, projMatrix, nf) {
  // 使用矩阵设置可视空间
  projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far);

  // 将投影矩阵传给u_ProjMatrix变量
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  nf.innerHTML = `near: ${Math.round(g_near * 100) / 100}, far: ${Math.round(g_far * 100)/100}`;
  gl.drawArrays(gl.TRIANGLES, 0, n);
}