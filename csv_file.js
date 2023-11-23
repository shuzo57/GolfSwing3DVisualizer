import * as THREE from './build/three.module.js';
import { OrbitControls } from './controls/OrbitControls.js';

let scene, camera, renderer, cube, controls, data

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

    const material = new THREE.MeshNormalMaterial();

    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 0.5;

    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    controls.enableZoom = true;
}
const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update();

    renderer.render(scene, camera);
};

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// シーンの初期化
function initScene() {
    scene = new THREE.Scene();
}

// 球体の追加
function addSphere(x, y, z) {
    const geometry = new THREE.SphereGeometry(0.01, 32, 32); // 半径、縦分割数、横分割数
    const material = new THREE.MeshNormalMaterial();
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);

    scene.add(sphere);
}

// 線の追加
function addLine(x1, y1, z1, x2, y2, z2) {
    const points = [];
    points.push(new THREE.Vector3(x1, y1, z1));
    points.push(new THREE.Vector3(x2, y2, z2));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });


    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

// カメラの位置を調整
function adjustCamera(frame_data) {
    // frame_dataから座標を取得
    const x1 = parseFloat(frame_data[1]);
    const y1 = parseFloat(frame_data[2]);
    const z1 = parseFloat(frame_data[3]);

    // シーンの中心座標を計算（例：最初の座標点を使用）
    const centerX = x1;
    const centerY = y1;
    const centerZ = z1;

    // カメラの位置を設定（シーンの中心から少し離れた位置）
    camera.position.x = centerX + 0.5;
    camera.position.y = centerY + 0.5;
    camera.position.z = centerZ + 0.5;

    // カメラの注視点をシーンの中心に設定
    controls.target.set(centerX, centerY, centerZ);

    // カメラとコントロールを更新
    camera.updateProjectionMatrix();
    controls.update();
}

// データの抽出
function extractData(data, frame) {
    if (frame < 0 || frame >= data.length) {
        console.error("指定されたフレームはデータの範囲外です。");
        return null;
    }
    return data[frame];
}

// データの描画（1フレーム文のデータのみ）
// frame_data[0]はフレーム番号
function drawData(frame_data) {
    const x1 = frame_data[1];
    const y1 = frame_data[2];
    const z1 = frame_data[3];

    const x2 = frame_data[4];
    const y2 = frame_data[5];
    const z2 = frame_data[6];

    addSphere(x1, y1, z1);
    addSphere(x2, y2, z2);
    addLine(x1, y1, z1, x2, y2, z2);
    adjustCamera(frame_data);
}


function handleFiles(files) {
    if (files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const text = e.target.result;
        data = parseCSV(text);
        const frame_data = extractData(data, 1);
        console.log(frame_data);
        initScene();
        drawData(frame_data);
    };

    reader.readAsText(file);
}

function parseCSV(text) {
    const rows = text.split('\n');

    return rows.map(row => row.trim().split(','));
}

window.addEventListener("resize", onWindowResize, false);

document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();

    document.getElementById('customButton').addEventListener('click', () => {
        document.getElementById('csvFileInput').click();
    });

    document.getElementById('csvFileInput').addEventListener('change', (e) => {
        const chosenFile = e.target.files[0];
        if (chosenFile) {
            document.getElementById('fileChosen').textContent = chosenFile.name;
        } else {
            document.getElementById('fileChosen').textContent = 'ファイルが選択されていません';
        }

        handleFiles(e.target.files);
    });
});
