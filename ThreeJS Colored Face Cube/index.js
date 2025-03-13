//new function variables
let isFullscreen = false;

let width = 500;
let height = 400;


// Create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const defaultColors = [
  new THREE.Color(0xFF7F00), // Orange
  new THREE.Color(0xFFFF00), // Yellow
  new THREE.Color(0x00FF00), // Green
  new THREE.Color(0x0000FF), // Blue
  new THREE.Color(0x8B00FF), // Violet
  new THREE.Color(0xFF0000)  // Red
];


// CREATE YOUR CUBE HERE
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = [
  new THREE.MeshBasicMaterial({ color: defaultColors[0] }),
  new THREE.MeshBasicMaterial({ color: defaultColors[1] }),
  new THREE.MeshBasicMaterial({ color: defaultColors[2] }),
  new THREE.MeshBasicMaterial({ color: defaultColors[3] }),
  new THREE.MeshBasicMaterial({ color: defaultColors[4] }),
  new THREE.MeshBasicMaterial({ color: defaultColors[5] }),
];
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

let wireframe = false;
let angleX = 0; // Rotation around the X-axis
let angleY = 0; // Rotation around the Y-axis

// Handle keyboard inputs
function onKeyDown(event) {
  // WRITE YOUR CODE HERE
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
  }
}

window.addEventListener("keydown", onKeyDown);

// Rotate the cube based on button clicks
function rotateCube(direction) {
  // WRITE YOUR CODE HERE
  switch (direction) {
    case "up":
      angleX = angleX - 0.1;
      break;
    case "down":
      angleX = angleX + 0.1;
      break;
    case "left":
      angleY = angleY - 0.1;
      break;
    case "right":
      angleY = angleY + 0.1;
      break;
  }
}

// Function to toggle wireframe
function toggleWireframe() {
  // WRITE YOUR CODE HERE
  wireframe = !wireframe;

  for (let i = 0; i < 6; i++) {
    cube.material[i].wireframe = wireframe;
  }

}


//fullscreen button
function toggleScreen() {
  isFullscreen = !isFullscreen;

  if (isFullscreen) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    console.log("New Renderer Size:", renderer.getSize(new THREE.Vector2())); // Debugging
    console.log("New Camera Aspect:", camera.aspect); // Debugging
  } else {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    console.log("New Renderer Size:", renderer.getSize(new THREE.Vector2())); // Debugging
    console.log("New Camera Aspect:", camera.aspect); // Debugging
  }
}


document.getElementById("fullScreen").addEventListener("click", () => {
  toggleScreen();
});

let orbital = false;
let freeRotation = false;

// function that moves cube with mouse
function orbitalMovement() {
}

//function that moves cube without any user input
function handsFreeRotation() {
}

// Setup dat.GUI
const gui = new dat.GUI();
gui.add({ wireframe: false }, "wireframe").onChange(toggleWireframe);
gui.add({ orbital: false }, "orbital").onChange(orbitalMovement);
gui.add({ freeRotation: false }, "freeRotation").onChange(handsFreeRotation);

// Position the dat.GUI above the buttons
gui.domElement.style.position = "absolute";
gui.domElement.style.top = "10px"; // Position it at the top left corner
gui.domElement.style.left = "10px"; // Align with left side

// Set up a basic animation loop to render the scene
function animate() {
  requestAnimationFrame(animate);

  // Apply rotation to the cube
  // WRITE YOUR CODE HERE
  if(orbital){
    controls.update();
  }

  cube.rotation.x = angleX;
  cube.rotation.y = angleY;

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
