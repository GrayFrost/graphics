function main() {
  let canvas = document.getElementById('webgl');
  let gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearColor(1.0, 0.8, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}