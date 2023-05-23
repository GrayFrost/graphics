# 第2章

var scene = new THREE.Scene();

// camera
var camera = new THREE.PerspectiveCamera()
scene.add(camera)

// renderer
var renderer = new THREE.WebGLRenderer();

// object
var obj = new THREE.Mesh(geometry, material)
scene.add(obj)

// light
var light = new THREE.AmbientLight();
scene.add(light)

document.getElementById("").appendChild(renderer.domElement)

## scene 属性和方法
scene.add()
scene.children
scene.fog
scene.overrideMaterial
scene.remove()
scene.traverse()