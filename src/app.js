import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';

// --- Basic Scene Setup ---
let scene, camera, renderer, controls;
let pyraminxGroup; // A group to hold all pieces
let pieces = { tips: [], edges: [] }; // To store references to piece meshes
let isRotating = false; // Prevent multiple rotations at once

// --- Constants ---
const COLORS = {
    R: new THREE.Color(0xff0000), // Red
    G: new THREE.Color(0x00cc00), // Green
    B: new THREE.Color(0x0000ff), // Blue
    Y: new THREE.Color(0xffff00), // Yellow
    BLACK: new THREE.Color(0x202020) // Plastic color
};

const ROTATION_ANGLE = Math.PI * 2 / 3; // 120 degrees

// Define axes and piece indices for each layer rotation
// Note: Axes and indices depend heavily on the initial piece setup
// These might need adjustment based on precise geometry and orientation
const LAYERS = {
    R: { axis: new THREE.Vector3(0, 1, 0), tipIndices: [0], edgeIndices: [0, 1, 2] }, // Example
    G: { axis: new THREE.Vector3(1, 0, 0), tipIndices: [1], edgeIndices: [0, 3, 4] }, // Example
    B: { axis: new THREE.Vector3(0, 0, 1), tipIndices: [2], edgeIndices: [1, 3, 5] }, // Example
    Y: { axis: new THREE.Vector3(-1, -1, -1).normalize(), tipIndices: [3], edgeIndices: [2, 4, 5] } // Example
    // IMPORTANT: Actual axes need calculation based on tetrahedron geometry
};

// --- Initialization ---
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    // Camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(5, 5, 5); // Adjusted camera position

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Pyraminx Group
    pyraminxGroup = new THREE.Group();
    scene.add(pyraminxGroup);

    // Create Pieces (Simplified)
    createPyraminxPieces();

    // Setup Rotation Buttons
    setupButtons();

    // Handle Window Resize
    window.addEventListener('resize', onWindowResize);

    // Start Animation Loop
    animate();
}

// --- Create Pyraminx Pieces (Simplified) ---
function createPyraminxPieces() {
    // --- Geometry & Materials (Simplified) ---
    // Using Tetrahedron for tips, maybe scaled boxes/custom shapes for edges
    // This requires significant geometric calculation for accurate shapes & placement.
    // For this example, we'll create placeholder shapes.

    const tipGeometry = new THREE.TetrahedronGeometry(0.5);
    const edgeGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.2); // Placeholder

    // Create 4 Tips
    for (let i = 0; i < 4; i++) {
        // Assign materials/colors per face - complex for standard geometry
        // For simplicity, using a single color material here
        const material = new THREE.MeshStandardMaterial({
             color: Object.values(COLORS)[i % 4], // Cycle through R,G,B,Y for demo
             roughness: 0.5,
             metalness: 0.2
        });
        const tip = new THREE.Mesh(tipGeometry, material);
        // Position tips at corners of a larger tetrahedron - requires calculation
        // Placeholder positions:
        const positions = [
             [ 0, 1.5, 0], // Top (approx)
             [ 1, 0, 1], // Corner 1 (approx)
             [-1, 0, 1], // Corner 2 (approx)
             [ 0, 0, -1]  // Corner 3 (approx) - Needs adjustment for tetrahedron
        ];
         // Correct positioning needs vertex calculation for a tetrahedron
         // E.g., using vertices like: (1,1,1), (1,-1,-1), (-1,1,-1), (-1,-1,1) scaled appropriately
        tip.position.set(...positions[i]);
        tip.userData = { id: `T${i}`, type: 'tip', index: i };
        pieces.tips.push(tip);
        pyraminxGroup.add(tip);
    }

     // Create 6 Edges
    for (let i = 0; i < 6; i++) {
         // Multi-material approach needed for correct sticker colors
         const material = new THREE.MeshStandardMaterial({
             color: COLORS.BLACK, // Placeholder plastic color
             roughness: 0.5,
             metalness: 0.2
         });
         const edge = new THREE.Mesh(edgeGeometry, material);
         // Position edges between tips - requires calculation
         // Placeholder positions:
         edge.position.set(Math.random() * 2 - 1, Math.random() * 2, Math.random() * 2 - 1);
         edge.lookAt(pyraminxGroup.position); // Orient roughly
         edge.userData = { id: `E${i}`, type: 'edge', index: i };
         pieces.edges.push(edge);
         pyraminxGroup.add(edge);
     }

    // --- IMPORTANT LIMITATION ---
    // This creation part is highly simplified. A real simulator needs:
    // 1. Accurate geometry for tips and especially edge pieces.
    // 2. Correct positioning and orientation of all 10 pieces to form the tetrahedron.
    // 3. Applying multiple materials (colors) to the specific faces of each piece's geometry
    //    to represent the stickers accurately (e.g., using materialIndex on BufferGeometry).
    // 4. Correctly calculating rotation axes based on the final geometry.
    console.warn("Piece geometry, placement, coloring, and rotation axes are simplified placeholders in this example.");
}


// --- Setup Button Listeners ---
function setupButtons() {
    document.getElementById('rotate-r')?.addEventListener('click', () => rotateLayer('R', true));
    document.getElementById('rotate-g')?.addEventListener('click', () => rotateLayer('G', true));
    document.getElementById('rotate-b')?.addEventListener('click', () => rotateLayer('B', true));
    document.getElementById('rotate-y')?.addEventListener('click', () => rotateLayer('Y', true));
    // Could add buttons for counter-clockwise or use shift-click etc.
}

// --- Rotate Layer Function ---
function rotateLayer(layerKey, clockwise = true) {
    if (isRotating) return; // Don't start a new rotation if one is in progress
    isRotating = true;

    const layerInfo = LAYERS[layerKey];
    if (!layerInfo) {
        console.error("Invalid layer key:", layerKey);
        isRotating = false;
        return;
    }

    const angle = clockwise ? -ROTATION_ANGLE : ROTATION_ANGLE;
    const duration = 500; // milliseconds for rotation animation

    // Identify pieces in the layer
    const rotationGroup = new THREE.Group();
    const piecesToRotate = [];

    layerInfo.tipIndices.forEach(index => {
        if (pieces.tips[index]) piecesToRotate.push(pieces.tips[index]);
    });
    layerInfo.edgeIndices.forEach(index => {
         if (pieces.edges[index]) piecesToRotate.push(pieces.edges[index]);
    });

    if (piecesToRotate.length === 0) {
         console.warn("No pieces found for layer:", layerKey);
         isRotating = false;
         return;
    }

    // Move pieces to the temporary rotation group
    // Using attach preserves world transforms temporarily
    piecesToRotate.forEach(piece => {
        pyraminxGroup.attach(piece); // Ensure it's parented to the main group first
        rotationGroup.attach(piece); // Attach to rotation group
    });
    scene.add(rotationGroup); // Add rotation group to scene

    // --- Animation using TWEEN ---
    new TWEEN.Tween(rotationGroup.rotation)
        .to({ [layerInfo.axis.x ? 'x' : layerInfo.axis.y ? 'y' : 'z']: rotationGroup.rotation[layerInfo.axis.x ? 'x' : layerInfo.axis.y ? 'y' : 'z'] + angle }, duration)
        .easing(TWEEN.Easing.Quadratic.Out) // Smooth easing
        .onComplete(() => {
            // Move pieces back to the main pyraminx group
             piecesToRotate.forEach(piece => {
                 rotationGroup.attach(piece); // Ensure parented before attaching back
                 pyraminxGroup.attach(piece); // Attach back to main group
             });
            scene.remove(rotationGroup); // Remove temporary group
            // --- State Update ---
            // A real simulator would update its internal state representation here
            // to know which sticker is where after the rotation.
            console.log(`Layer ${layerKey} rotation finished.`);
            isRotating = false;
        })
        .start();
}


// --- Handle Window Resize ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // For damping
    TWEEN.update(); // Update animations
    renderer.render(scene, camera);
}

// --- Run ---
init();
