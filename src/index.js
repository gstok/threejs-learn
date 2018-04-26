

import World from "./world.js";

//datGUI控制的变量
let controls = new function () {
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

    this.addFace = () => {

        let vertices = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(100, 0, 0),
            new THREE.Vector3(0, 0, 100),
            new THREE.Vector3(100, 0, 100),
            new THREE.Vector3(50, 100, 50)
        ];

        function newFace3(a, b, c) {
            return [
                new THREE.Face3(a, b, c),
                new THREE.Face3(b, a, c)
            ];
        }

        function newRect(a, b, c, d) {
            return [
                ...newFace3(a, b, c),
                ...newFace3(b, c, d)
            ]
        }

        let faces = [
            ...newRect(0, 1, 2, 3),

            ...newFace3(2, 3, 4),
            ...newFace3(0, 1, 4),
            ...newFace3(0, 2, 4),
            ...newFace3(1, 3, 4)
        ];

        let geometry = new THREE.Geometry();
        geometry.vertices = vertices;
        geometry.faces = faces;
        geometry.computeFaceNormals();

        let material = new THREE.MeshStandardMaterial({
            color: 0xff0000
        });

        custom = new THREE.Mesh(geometry, material);

        scene.add(custom);
    },

    this.customColor = 0x482fd8
}

window.onload = () => {
    let myWorld = new World(document.getElementById("three-area"));
};
















