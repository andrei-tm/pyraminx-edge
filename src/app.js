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

const createTriangleWith7Parts = () => {
    const group = new THREE.Group();

    const colors = [0xff0000, 0x0000ff, 0xffff00, 0x0000ff, 0xffff00, 0x0000ff, 0x000000];
    const positions = [
        { x: 0, y: 1, z: 0 }, // Top red triangle
        { x: -0.5, y: 0.5, z: 0 }, // Left blue triangle
        { x: 0.5, y: 0.5, z: 0 }, // Right yellow triangle
        { x: -0.75, y: 0, z: 0 }, // Bottom-left blue triangle
        { x: 0, y: 0, z: 0 }, // Center yellow triangle
        { x: 0.75, y: 0, z: 0 }, // Bottom-right blue triangle
        { x: 0, y: -0.5, z: 0 } // Bottom black triangle
    ];

    for (let i = 0; i < 7; i++) {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            0, 0, 0, // Vertex 1
            -0.5, 0, 0, // Vertex 2
            0.5, 0, 0 // Vertex 3
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex([0, 1, 2]); // Define the triangle face
        geometry.computeVertexNormals();

        const material = new THREE.MeshBasicMaterial({ color: colors[i] });
        const triangle = new THREE.Mesh(geometry, material);
        triangle.position.set(positions[i].x, positions[i].y, positions[i].z);
        group.add(triangle);
    }

    return group;
};

const pyraminxEdge = createPyraminxEdge();
scene.add(pyraminxEdge);

const triangleWith7Parts = createTriangleWith7Parts();
triangleWith7Parts.position.x = 3; // Move it next to the Pyraminx
scene.add(triangleWith7Parts);

camera.position.z = 5;

const animate = function () {
    requestAnimationFrame(animate);
    pyraminxEdge.rotation.x += 0.01;
    pyraminxEdge.rotation.y += 0.01;
    triangleWith7Parts.rotation.y += 0.01;
    renderer.render(scene, camera);
};

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});