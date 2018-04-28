
import * as THREE from "three";

class Point {
    constructor (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toVector3 () {
        return new THREE.Vector3(this.x, this.y, this.z);
    }
}

export default Point;