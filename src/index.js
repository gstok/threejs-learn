

import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import ThreeStats from '../lib/three-stats.js';
import { Stats, dat } from 'threejs-utils';
import AsciiEffect from "three-asciieffect";

//容纳Three.js的作图区域
let threeArea;
//场景，摄像机，以及WebGL渲染器
let scene, camera, render, asciiRender;
//各种组件
let stats, gui;
//场景内的各种对象
let plane, cube, sphere;
//
let controls = new function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
}

//向场景之中添加需展示的对象
function addGeometry (scene) {
    //添加坐标系
    let axes = new THREE.AxesHelper(50);
    scene.add(axes);

    //在底部添加一个平面
    plane = createPlane();
    scene.add(plane);
    //添加一个立方体
    cube = createCube();
    scene.add(cube);
    //添加一个球体
    sphere = createSphere();
    scene.add(sphere);

    //添加直线光源
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-100, 200, -100);
    spotLight.castShadow = true;
    spotLight.shadowMapHeight = 1024;
    spotLight.shadowMapWidth = 1024;
    scene.add(spotLight);

    // let ambientLight = new THREE.AmbientLight(0xffffff);
    // scene.add(ambientLight);

    let hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.6);
    hemisphereLight.position.set(0, 200, 0);
    scene.add(hemisphereLight);
}


//创建立方体
function createCube () {
    let cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    let cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x8fBc8f
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(10, 10, 10);
    cube.castShadow = true;
    return cube; 
}

//创建球体
function createSphere () {
    let sphereGeometry = new THREE.SphereGeometry(10, 20, 20);
    let sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x7777ff
    });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(30, 30, 30);
    sphere.castShadow = true;
    return sphere;
}

//创建面板平面
function createPlane () {
    let planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    let planeMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //设置平面角度
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, -1, 0);
    plane.receiveShadow = true;
    plane.shadowDarkness = 0.9;
    return plane;
}

//初始化
function init () {
    stats = initStats();
    gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.2);
    gui.add(controls, 'bouncingSpeed', 0, 0.2);


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

    render.gammaInput = true;
    render.gammaOutput = true;
    render.shadowMap.enabled = true;
    render.shadowMapType = THREE.PCFSoftShadowMap;

    //添加各种对象
    addGeometry(scene);

    asciiRender = new AsciiEffect(render);

    //添加到页面以及渲染各种事件响应
    threeArea.appendChild(render.domElement);
    //threeArea.appendChild(asciiRender.domElement);

    //配置轨道控制器
    let orbitControls = new OrbitControls(camera, render.domElement);
    //let orbitControls = new OrbitControls(camera, asciiRender.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.25;
    orbitControls.enableZoom = true;
    orbitControls.autoRotate = true;

    render.setSize(threeArea.clientWidth, threeArea.clientHeight);
    //asciiRender.setSize(threeArea.clientWidth, threeArea.clientHeight);
    
    render.render(scene, camera);
    //asciiRender.render(scene, camera);
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
    //asciiRender.setSize(width, height);
}

let step = 0;

//响应更新画面的函数
function animate() {
    stats.update();

    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;
    
    step += controls.bouncingSpeed;
    sphere.position.x = 30 * Math.cos(step);
    sphere.position.y = 10 + Math.abs(20 * Math.sin(step));
    
    requestAnimationFrame(animate);

    render.render(scene, camera);
    //asciiRender.render(scene, camera);
}

window.onload = init;


function initStats () {
    let stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("three-area").appendChild(stats.domElement);
    return stats;
}
