import * as THREE from './build/three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';

let scene, camera, renderer, cube, controls;

function init() {
    // シーン
    scene = new THREE.Scene();

    // カメラ
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // レンダラー
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // ジオメトリ
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // マテリアル
    const material = new THREE.MeshNormalMaterial();

    // メッシュ
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    //カメラ位置
    camera.position.z = 5;

    // OrbitControlsのインスタンスを作成
    controls = new OrbitControls(camera, renderer.domElement);

    // カメラの位置をマウスで操作できるようにする
    controls.enableDamping = true; // true:有効, false:無効
    controls.dampingFactor = 0.2; // カメラの回転速度
    controls.enableZoom = true; // true:ズーム有効, false:ズーム無効
}
// レンダリング
const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;

    // OrbitControlsのアップデート
    controls.update();

    renderer.render(scene, camera);
};

// ウィンドウ変更時にサイズを維持する処理
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

window.addEventListener("resize", onWindowResize, false);

init();
animate();