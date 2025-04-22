const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const createPyraminxEdge = () => {
    const geometry = new THREE.TetrahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    const pyraminxEdge = new THREE.Mesh(geometry, material);
    return pyraminxEdge;
};

const pyraminxEdge = createPyraminxEdge();
scene.add(pyraminxEdge);

camera.position.z = 5;

const animate = function () {
    requestAnimationFrame(animate);
    pyraminxEdge.rotation.x += 0.01;
    pyraminxEdge.rotation.y += 0.01;
    renderer.render(scene, camera);
};

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});