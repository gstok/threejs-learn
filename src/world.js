
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import ThreeStats from '../lib/three-stats.js';
import { Stats, dat } from 'threejs-utils';
import AsciiEffect from "three-asciieffect";
import ThreeSceneUtils from "../lib/ThreeSceneUtils";

class World {
    constructor (domElement) {

        //获得作图区域的DOM元素
        this.threeArea = domElement;
        //创建场景
        this.scene = new THREE.Scene();
        //创建摄像机
        this.camera = this.createCamera();
        this.camera.lookAt(this.scene.position);


        //添加各种对象
        this.addThings();
        
        
        //创建添加渲染器
        this.renderer = this.createRenderer();
        
        //render工作，配置动画，响应事件
        this.renderer.render(this.scene, this.camera);
        this.animate();
        window.addEventListener("resize", () => {
            this.onThreeResize();
        }, false);


        //添加各种插件
        this.addPlugin();
    }


    //添加各种插件
    addPlugin () {
        //创建轨道控制器
        this.orbitControls = this.addOrbitControls();
        //创建Stats
        this.stats = this.addStats(); 
    
        this.testNum = 30;
        this.myObj = 50;
        
        //创建datGui
        this.datGui = this.addDatGui();
    }


    //创建渲染器
    createRenderer () {
        let renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xf0f0f0);
        renderer.setSize(this.threeArea.clientWidth, this.threeArea.clientHeight);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        
        renderer.shadowMap.enabled = true;
        renderer.shadowMapEnabled = true;

        renderer.shadowMap.enabled = true;
        renderer.shadowMapType = THREE.PCFSoftShadowMap;

        renderer.shadowMapType = THREE.PCFSoftShadowMap;
        this.threeArea.appendChild(renderer.domElement);
        return renderer;
    }    
    //创建摄像机
    createCamera () {
        let camera = new THREE.PerspectiveCamera(45, this.threeArea.clientWidth / this.threeArea.clientHeight, 0.1, 10000);
        camera.position.x = 500;
        camera.position.y = 500;
        camera.position.z = 500;
        return camera;
    }
    //创建面板平面
    createPlane () {
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
    //添加Stats
    addStats () {
        let stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        this.threeArea.appendChild(stats.domElement);
        return stats;
    }
    //添加datGui
    addDatGui () {
        let datGui = new dat.GUI();

        datGui.add(this, "testNum", -100, 100);
        datGui.add(this, "myObj");
        // datGui.add(this, "addCube");
        // datGui.add(this, "numberOfObjects").listen();
        // datGui.add(this, "removeCube");
        // datGui.add(this, "outputObjects");
        // datGui.add(this, "addCylinder");
        // datGui.add(this, "addCustomGeometry");
        // datGui.add(this, "addFace");
        // datGui.addColor(this, "customColor").onChange((e) => {
        //     let color = new THREE.Color(e);
        //     //custom.material.color = color;
        // });
        return datGui;
    }
    //添加轨道控制器
    addOrbitControls () {
        let orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.25;
        orbitControls.enableZoom = true;
        orbitControls.autoRotate = true;
        return orbitControls;
    }

    //响应绘制区域大小改变的函数
    onThreeResize () {
        let width = this.threeArea.clientWidth;
        let height = this.threeArea.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    //响应更新画面的函数
    animate () {
        if (this.stats) {
            this.stats.update();
        }
        requestAnimationFrame(() => {
            this.animate();
        });
        this.renderer.render(this.scene, this.camera);
    }


    //创建坐标轴
    createAxis (size) {
        let axes = new THREE.AxesHelper(size);
        return axes;
    }

    //向场景之中添加各种需展示的对象
    addThings () {
        //添加坐标系
        this.axis = this.createAxis(500);
        this.scene.add(this.axis);

        //在底部添加一个平面
        this.plane = this.createPlane();
        this.scene.add(this.plane);
        //添加聚光灯光源
        this.spotLight = this.createSpotLight();
        this.scene.add(this.spotLight);
        // //添加半球光源
        // this.hemisphereLight = this.createHemisphereLight();
        // this.scene.add(this.hemisphereLight);
        // //添加环境光源
        // this.ambientLight = this.createAmbientLight();
        // this.scene.add(this.ambientLight);

        this.custom = this.createCustomGeometry();
        this.scene.add(this.custom);
    }

    faceBord3 (a, b, c) {
        return [
            new THREE.Face3(a, b, c),
            new THREE.Face3(b, a, c)
        ];
    }

    faceBord4 (a, b, c, d) {
        return [
            ...this.faceBord3(a, b, c),
            ...this.faceBord3(b, c, d)
        ];
    }

    //创建自定义几何体
    createCustomGeometry () {

        let boxGeometry = new THREE.BoxGeometry(100, 100, 100);
        let boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x2387d0
        });
        let box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;
        box.position.set(0, 100, 0);

        return box;



        // let vertices = [
        //     new THREE.Vector3(0, 0, 0),
        //     new THREE.Vector3(100, 0, 0),
        //     new THREE.Vector3(0, 0, 100),
        //     new THREE.Vector3(100, 0, 100),
        //     new THREE.Vector3(50, 80, 50)
        // ];
        // let faces = [
        //     ...this.faceBord4(0, 1, 2, 3),
        //     ...this.faceBord3(0, 1, 4),
        //     ...this.faceBord3(1, 3, 4),
        //     ...this.faceBord3(3, 2, 4),
        //     ...this.faceBord3(0, 2, 4)
        // ];
        // let geometry = new THREE.Geometry();
        // geometry.vertices = vertices;
        // geometry.faces = faces;
        // geometry.computeFaceNormals();
        // let materials = [
        //     new THREE.MeshStandardMaterial({
        //         color: 0x9468e0
        //     }),
        //     new THREE.MeshBasicMaterial({
        //         color: 0x000000,
        //         wireframe: true
        //     }),
        // ];
        // let custom = ThreeSceneUtils.createMultiMaterialObject(geometry, materials);
        // custom.children.forEach(item => {
        //     item.castShadow = true;
        // });
        // return custom;
    }

    //创建聚光灯光源
    createSpotLight () {
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-100, 600, 400);
        spotLight.castShadow = true;
        spotLight.shadowMapHeight = 1024;
        spotLight.shadowMapWidth = 1024;
        return spotLight;
    }
    //创建半球光源
    createHemisphereLight () {
        let hemisphereLight = new THREE.HemisphereLight(0xfefefe, 0x333333, 0.6);
        hemisphereLight.position.set(0, 200, 0);
        return hemisphereLight;
    }
    //创建环境光源
    createAmbientLight () {
        let ambientLight = new THREE.AmbientLight(0xfefefe);
        return ambientLight;
    }
};

export default World;