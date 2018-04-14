

import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

//容纳Three.js的作图区域
let threeArea;
//场景，摄像机，以及WebGL渲染器
let scene, camera, render;

//向场景之中添加需展示的对象
function addGeometry (scene) {
    //添加坐标系
    let axes = new THREE.AxesHelper(50);
    scene.add(axes);
    //在底部添加一个平面
    let planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    let planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //设置平面角度
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, -1, 0);
    scene.add(plane);
    //添加一个立方体
    let cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    let cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0x8fBc8f,
        wireframe: true
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(10, 10, 10);
    scene.add(cube);
    //添加一个球体
    let sphereGeometry = new THREE.SphereGeometry(10, 20, 20);
    let sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777ff,
        wireframe: true
    });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(30, 30, 30);
    scene.add(sphere);
}

//初始化
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
    render.setClearColor(0xf0f0f0);
    render.setSize(threeArea.clientWidth, threeArea.clientHeight);
    render.gammaInput = true;
    render.gammaOutput = true;
    render.shadowMap.enabled = true;

    //添加各种对象
    addGeometry(scene);

    //配置轨道控制器
    let controls = new OrbitControls(camera, render.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;

    //添加到页面以及渲染各种事件响应
    threeArea.appendChild(render.domElement);
    render.render(scene, camera);
    window.addEventListener('resize', onWindowResize, false);
    animate();
}

//响应窗体大小修改的函数
function onWindowResize() {
    let width = threeArea.clientWidth;
    let height = threeArea.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render.setSize(width, height);
}

//响应更新画面的函数
function animate() {
    requestAnimationFrame(animate);
    render.render(scene, camera);
}

window.onload = init;

