

import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

//容纳Three.js的作图区域
let threeArea;
//场景，摄像机，以及WebGL渲染器
let scene, camera, render;

function addGeometry (scene) {
    //在底部添加一个平面
    let planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    let planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x005569
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = -1;
    plane.position.z = 0;
    scene.add(plane);
    //添加一个立方体
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        wireframe: true
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube);
    //添加一个球体
    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777ff,
        wireframe: true
    });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 20;
    sphere.position.z = 20;
    scene.add(sphere);
}

function init () {
    //获得作图区域的DOM元素
    threeArea = document.getElementById("three-area");
    //创建场景
    scene = new THREE.Scene();
    //创建摄像机
    camera = new THREE.PerspectiveCamera(45, threeArea.clientWidth / threeArea.clientHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 100;
    camera.position.z = 100;
    camera.lookAt(scene.position);
    //camera.lookAt(0, 0, 0);
    //创建WebGL渲染器
    render = new THREE.WebGLRenderer();
    render.setClearColor(0xdddddd);
    render.setSize(threeArea.clientWidth, threeArea.clientHeight);
    render.gammaInput = true;
    render.gammaOutput = true;
    render.shadowMap.enabled = true;
    //创建坐标系
    let axes = new THREE.AxesHelper(50);
    scene.add(axes);
    //添加各种对象
    addGeometry(scene);
    //配置轨道控制器
    var controls = new OrbitControls(camera, render.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    threeArea.appendChild(render.domElement);
    render.render(scene, camera);

    window.addEventListener('resize', onWindowResize, false);
    animate();
}

function onWindowResize() {
    let width = threeArea.clientWidth;
    let height = threeArea.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);
    render.render(scene, camera);
    //stats.update();
}

window.onload = init;

