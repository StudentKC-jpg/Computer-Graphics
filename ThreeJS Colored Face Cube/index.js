// Create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// Create a cube with six different colored faces
const geometry = new THREE.BoxGeometry();
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Red
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Green
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Blue
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Yellow
    new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Magenta
    new THREE.MeshBasicMaterial({ color: 0x00ffff })  // Cyan
];

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

let wireframe = false;
let angleX = 0; // Rotation around the X-axis
let angleY = 0; // Rotation around the Y-axis

// Handle keyboard inputs
function onKeyDown(event) {
    switch (event.key) {
        case "ArrowUp":
            rotateCube("up");
            break;
        case "ArrowDown":
            rotateCube("down");
            break;
        case "ArrowLeft":
            rotateCube("left");
            break;
        case "ArrowRight":
            rotateCube("right");
            break;
    }
}

window.addEventListener("keydown", onKeyDown);

// Rotate the cube based on button clicks
function rotateCube(direction) {
    const rotationAmount = Math.PI / 8; // Adjust rotation speed
    switch (direction) {
        case "up":
            angleX -= rotationAmount;
            break;
        case "down":
            angleX += rotationAmount;
            break;
        case "left":
            angleY -= rotationAmount;
            break;
        case "right":
            angleY += rotationAmount;
            break;
    }
}

// Function to toggle wireframe
function toggleWireframe() {
    wireframe = !wireframe;
    cube.material.forEach(material => material.wireframe = wireframe);
}

// Setup dat.GUI
const gui = new dat.GUI();
gui.add({ wireframe: false }, "wireframe").onChange(toggleWireframe);

// Position the dat.GUI above the buttons
gui.domElement.style.position = "absolute";
gui.domElement.style.top = "10px"; // Position it at the top left corner
gui.domElement.style.left = "10px"; // Align with left side

// Set up a basic animation loop to render the scene
function animate() {
    requestAnimationFrame(animate);

    // Apply rotation to the cube
    cube.rotation.x = angleX;
    cube.rotation.y = angleY;

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
