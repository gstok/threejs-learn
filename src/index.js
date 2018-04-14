

import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper } from 'three';
import OrbitControls from 'three-orbitcontrols';


function init () {
    let threeArea = document.getElementById("three-area");

    let scene = new Scene();
    let camera = new PerspectiveCamera(45, threeArea.clientWidth / threeArea.clientHeight, 0.1, 1000);
    let render = new WebGLRenderer();
    let axes = new AxesHelper(20);
    
    render.setClearColor(0xeeeeee);
    render.setSize(threeArea.clientWidth, threeArea.clientHeight);
    
    scene.add(axes);
    
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    
    
    let controls = new OrbitControls(camera, render.domElement);
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false
    
    threeArea.appendChild(render.domElement);
    render.render(scene, camera);
}

window.onload = init;

