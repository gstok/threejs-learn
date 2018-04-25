

import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import ThreeStats from '../lib/three-stats.js';
import { Stats, dat } from 'threejs-utils';
import AsciiEffect from "three-asciieffect";
import { last } from 'rxjs/operators';
import { scan } from 'rxjs/operator/scan';

//容纳Three.js的作图区域
let threeArea;
//场景，摄像机，以及WebGL渲染器
let scene, camera, render, asciiRender;
//各种组件
let stats, datGui;
//场景内的各种对象
let plane, cube, sphere;
//场景内的光源
let spotLight, hemisphereLight, ambientLight;
//坐标系
let axes;


//datGUI控制的变量
let controls = new function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;

    this.spotX = 0;
    this.spotY = 400;
    this.spotZ = 0;

    this.hmspX = 0;
    this.hmspY = 200;
    this.hmspZ = 0;

    this.alert = () => {
        alert("你好，世界");
    },

    this.numberOfObjects = 0;


    //添加圆筒对象
    this.addCylinder = () => {
        let radiusTop = Math.floor(Math.random() * 10 + 3);
        let radiusBottom = Math.floor(Math.random() * 10 + 3);
        let cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, 100);
        let cylinderMaterial = new THREE.MeshStandardMaterial({
            color: Math.floor(Math.random() * 0xffffff)
        });
        let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.x = Math.random() * plane.geometry.parameters.width - 500;
        cylinder.position.y = 100;
        cylinder.position.z = Math.random() * plane.geometry.parameters.height - 500;
        cylinder.name = "cylinder-" + scene.children.length;
        scene.add(cylinder);
        this.numberOfObjects = scene.children.length;    
    },

    this.addCustomGeometry = () => {
        console.log("添加自定义几何体");

        //顶点坐标
        let vertices = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 100, 0),
            new THREE.Vector3(100, 0, 0),
            new THREE.Vector3(100, 100, 0),
            new THREE.Vector3(0, 0, 100),
            new THREE.Vector3(0, 100, 100),
            new THREE.Vector3(100, 0, 100),
            new THREE.Vector3(100, 100, 100),
        ];

        let faces = [
            //对面
            new THREE.Face3(2, 1, 0),
            new THREE.Face3(1, 2, 3),

            //前面
            new THREE.Face3(6, 5, 4),
            new THREE.Face3(5, 6, 7),

            //上面
            new THREE.Face3(7, 1, 5),
            new THREE.Face3(1, 7, 3),

            //下面
            new THREE.Face3(4, 0, 6),
            new THREE.Face3(2, 6, 0),

            //左面
            new THREE.Face3(5, 0, 4),
            new THREE.Face3(0, 5, 1),

            //右面
            new THREE.Face3(6, 3, 7),
            new THREE.Face3(3, 6, 2)
        ];

        let geometry = new THREE.Geometry();
        geometry.vertices = vertices;
        geometry.faces = faces;
        geometry.computeFaceNormals();
        //geometry.computeBoundingBox();
        geometry.mergeVertices();

        let material = new THREE.MeshStandardMaterial({
            color: Math.floor(Math.random() * 0xffffff)
        });

        let custom = new THREE.Mesh(geometry, material);

        custom.position.set(100, 100, 100);

        scene.add(custom);
    },

    //添加立方体
    this.addCube = () => {
        let cubeSize = Math.ceil(Math.random() * 50) + 10; 
        //创建立方体几何形状
        let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);  
        //创建立方体材质
        let cubeMaterial = new THREE.MeshStandardMaterial({
            color: Math.floor(Math.random() * 0xffffff)
        });
        //根据几何与材质创建网孔
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = Math.random() * plane.geometry.parameters.width - 500;
        cube.position.y = 100;
        cube.position.z = Math.random() * plane.geometry.parameters.height - 500;
        cube.name = "cube-" + scene.children.length;
        scene.add(cube);
        this.numberOfObjects = scene.children.length;
    },
    //删除立方体
    this.removeCube = () => {
        let meshList = scene.children.filter(item => item instanceof THREE.Mesh &&
                                                     item.geometry instanceof THREE.BoxGeometry);
        if (meshList.length > 0) {
            scene.remove(meshList[meshList.length - 1]);
            this.numberOfObjects = scene.children.length;
        }
    },
    //输出场景内所有对象
    this.outputObjects = () => {
        console.log(scene.children);
    }
}

//配置datGui
function datGuiConfig (datGui) {
    datGui.add(controls, 'rotationSpeed', 0, 0.2);
    datGui.add(controls, 'bouncingSpeed', 0, 0.2);
    datGui.add(controls, "spotX", -1000, 1000);
    datGui.add(controls, "spotY", -1000, 1000);
    datGui.add(controls, "spotZ", -1000, 1000);
    datGui.add(controls, "hmspX", -1000, 1000);
    datGui.add(controls, "hmspY", -1000, 1000);
    datGui.add(controls, "hmspZ", -1000, 1000);
    datGui.add(controls, "alert");
    datGui.add(controls, "addCube");
    datGui.add(controls, "numberOfObjects").listen();
    datGui.add(controls, "removeCube");
    datGui.add(controls, "outputObjects");
    datGui.add(controls, "addCylinder");
    datGui.add(controls, "addCustomGeometry");
}

//创建聚光灯光源
function createSpotLight () {
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(controls.spotX, controls.spotY, controls.spotZ);
    spotLight.castShadow = true;
    spotLight.shadowMapHeight = 1024;
    spotLight.shadowMapWidth = 1024;
    return spotLight;
}
//创建半球光源
function createHemisphereLight () {
    let hemisphereLight = new THREE.HemisphereLight(0xfefefe, 0x333333, 0.6);
    hemisphereLight.position.set(controls.hmspX, controls.hmspY, controls.hmspZ);
    return hemisphereLight;
}
//创建环境光源
function createAmbientLight () {
    let ambientLight = new THREE.AmbientLight(0xfefefe);
    return ambientLight;
}

//创建面板平面
function createPlane () {
    let planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
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

//创建摄像机
function createCamera () {
    let camera = new THREE.PerspectiveCamera(45, threeArea.clientWidth / threeArea.clientHeight, 0.1, 10000);
    camera.position.x = 500;
    camera.position.y = 500;
    camera.position.z = 500;
    return camera;
}

//创建渲染器
function createRender () {
    let render = new THREE.WebGLRenderer();
    render.setClearColor(0xf0f0f0);
    render.setSize(threeArea.clientWidth, threeArea.clientHeight);
    render.gammaInput = true;
    render.gammaOutput = true;
    render.shadowMap.enabled = true;
    render.shadowMapType = THREE.PCFSoftShadowMap;
    return render;
}



//向场景之中添加各种需展示的对象
function addThings (scene) {
    //添加坐标系
    axes = new THREE.AxesHelper(50);
    scene.add(axes);
    //在底部添加一个平面
    plane = createPlane();
    scene.add(plane);
    //添加直线光源
    spotLight = createSpotLight();
    scene.add(spotLight);
    //添加半球光源
    hemisphereLight = createHemisphereLight();
    scene.add(hemisphereLight);
    //添加环境光源
    ambientLight = createAmbientLight();
    scene.add(ambientLight);
}

//配置轨道控制器
function orbitControlsConfig (camera, render) {
    let orbitControls = new OrbitControls(camera, render.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.25;
    orbitControls.enableZoom = true;
    orbitControls.autoRotate = true;
}



//配置Stats
function statsConfig (stats) {
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("three-area").appendChild(stats.domElement);
}

//初始化
function init () {
    //创建配置Stats
    stats = new Stats();
    statsConfig(stats);

    //创建配置datGui
    datGui = new dat.GUI();
    datGuiConfig(datGui);

    //获得作图区域的DOM元素
    threeArea = document.getElementById("three-area");

    //创建场景
    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog(0xcccccc, 800, 3000);
    //另一种为场景添加雾化效果的方式
    // scene.fog = new THREE.FogExp2(0xcccccc, 0.001);

    //场景材质覆盖
    // scene.overrideMaterial = new THREE.MeshLambertMaterial({
    //     color: 0x445566
    // });

    //创建摄像机
    camera = createCamera();
    camera.lookAt(scene.position);

    //添加各种对象
    addThings(scene);

    //创建添加渲染器
    render = createRender();
    threeArea.appendChild(render.domElement);

    //render工作，配置动画，响应事件
    render.render(scene, camera);
    animate();
    window.addEventListener("resize", () => {
        onThreeResize(threeArea, camera, render);
    }, false);

    //轨道控制器配置
    orbitControlsConfig(camera, render);
}

//响应绘制区域大小改变的函数
function onThreeResize(dstDom, camera, render) {
    let width = dstDom.clientWidth;
    let height = dstDom.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render.setSize(width, height);
}

//响应更新画面的函数
function animate() {
    stats.update();
    spotLight.position.set(controls.spotX, controls.spotY, controls.spotZ);

    scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.BoxGeometry) {
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.01;
            obj.rotation.z += 0.01;
        }
    });

    requestAnimationFrame(animate);
    render.render(scene, camera);
}

window.onload = init;


