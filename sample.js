import * as THREE from './build/three.module.js';

let scene, camera, renderer, cube;

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
}
// レンダリング
const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

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