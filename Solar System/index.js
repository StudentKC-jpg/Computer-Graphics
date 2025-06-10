// scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 55, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 1.2, 100);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// space background
const cubeLoader = new THREE.CubeTextureLoader();
const spaceTexture = cubeLoader.load([
  'https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/space_map/cube_%2Bx.png',
  'https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/space_map/cube_-x.png',
  'https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/space_map/cube_%2By.png',
  'https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/space_map/cube_-y.png',
  'https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/space_map/cube_%2Bz.png',
  'https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/space_map/cube_-z.png',
]);
scene.background = spaceTexture;

// textures
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/planet_textures/2k_sun.jpg');
const mercuryTexture = textureLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/planet_textures/2k_mercury.jpg');
const venusTexture = textureLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/planet_textures/2k_venus_surface.jpg');
const earthTexture = textureLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/planet_textures/2k_earth_daymap.jpg');
const marsTexture = textureLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/planet_textures/2k_mars.jpg');
const jupiterTexture = textureLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/planet_textures/2k_jupiter.jpg');
const saturnTexture = textureLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/planet_textures/2k_saturn.jpg');
const uranusTexture = textureLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/planet_textures/2k_uranus.jpg');
const neptuneTexture = textureLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/Solar%20System/planet_textures/2k_neptune.jpg');

// sun
const sunGeo = new THREE.SphereGeometry(6, 32, 32);
const sunMat = new THREE.MeshStandardMaterial({
  emissive: 0xfdb813,
  emissiveIntensity: 1,
  toneMapped: false
});
const sun = new THREE.Mesh(sunGeo, sunMat);
sun.position.set(0, 0, 0);
scene.add(sun);


// Bloom
const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomParams = {
  strength: 1.1,
  radius: 0.6,
  threshold: 0.85,
};

const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  bloomParams.strength,
  bloomParams.radius,
  bloomParams.threshold
);
composer.addPass(bloomPass);

// planets
function createPlanet({ radius, map, distance, orbitSpeed }) {
  const orbit = new THREE.Object3D();
  scene.add(orbit);
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ 
    map,
    roughness: 1,
    metalness: 0
  });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = distance;
  planet.castShadow = true;
  planet.receiveShadow = true;
  orbit.add(planet);
  return { orbit, planet, orbitSpeed };
}

const planets = [
  createPlanet({ radius: 0.4, map: mercuryTexture, distance: 8, orbitSpeed: 0.2 }),
  createPlanet({ radius: 0.9, map: venusTexture, distance: 12, orbitSpeed: 0.15 }),
  createPlanet({ radius: 1, map: earthTexture, distance: 16, orbitSpeed: 0.1 }),
  createPlanet({ radius: 0.6, map: marsTexture, distance: 22, orbitSpeed: 0.08 }),
  createPlanet({ radius: 2.5, map: jupiterTexture, distance: 29, orbitSpeed: 0.05 }),
  createPlanet({ radius: 2.2, map: saturnTexture, distance: 36, orbitSpeed: 0.04 }),
  createPlanet({ radius: 1.7, map: uranusTexture, distance: 42, orbitSpeed: 0.03 }),
  createPlanet({ radius: 1.5, map: neptuneTexture, distance: 48, orbitSpeed: 0.02 }),
];

// orbit rings
const orbitRings = [];

function addOrbitRing(radius) {
  const geometry = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  ring.visible = false;
  scene.add(ring);
  orbitRings.push(ring);
}
planets.forEach(p => addOrbitRing(p.planet.position.x));

// GUI
const gui = new dat.GUI();
const settings = {
  showOrbitRings: false,
  bloomStrength: bloomParams.strength,
  bloomRadius: bloomParams.radius,
  bloomThreshold: bloomParams.threshold,
};

gui.add(settings, 'showOrbitRings').name('Orbit Rings').onChange(value => {
  orbitRings.forEach(ring => ring.visible = value);
});

gui.add(settings, 'bloomStrength', 0, 3).step(0.1).onChange(value => {
  bloomPass.strength = value;
});
gui.add(settings, 'bloomRadius', 0, 1).step(0.01).onChange(value => {
  bloomPass.radius = value;
});
gui.add(settings, 'bloomThreshold', 0, 1).step(0.01).onChange(value => {
  bloomPass.threshold = value;
});
gui.close();

// resize handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}, false);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  const delta = clock.getDelta();
  sun.rotation.y += 0.05 * delta;

  planets.forEach(p => {
    p.orbit.rotation.y += p.orbitSpeed * delta;
    p.planet.rotation.y += p.orbitSpeed * 8 * delta;
  });

  composer.render();
}

animate();
