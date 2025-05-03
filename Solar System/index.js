//scene
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0, 50, 10);
camera.lookAt(0, 0, 0);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(width, height);
renderer.antialias = true;
document.body.appendChild(renderer.domElement);

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2, 100);
scene.add(sunLight);

// sun
const sunGeometry = new THREE.SphereGeometry(6, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

//textures
const textureLoader = new THREE.TextureLoader();
const mercuryTexture = textureLoader.load('planet_textures/2k_mercury.jpg');
const venusTexture = textureLoader.load('planet_textures/2k_venus_surface.jpg');
const earthTexture = textureLoader.load('planet_textures/2k_earth_daymap.jpg');
const marsTexture = textureLoader.load('planet_textures/2k_mars.jpg');
const jupiterTexture = textureLoader.load('planet_textures/2k_jupiter.jpg');
const saturnTexture = textureLoader.load('planet_textures/2k_saturn.jpg');
const uranusTexture = textureLoader.load('planet_textures/2k_uranus.jpg');
const neptuneTexture = textureLoader.load('planet_textures/2k_neptune.jpg');

// planet setup
function createPlanet({
  radius = 1,
  map = null,
  distance = 10,
  orbitSpeed = 0.01,
  scene
}) {
  const orbit = new THREE.Object3D();
  scene.add(orbit);

  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map });
  const planet = new THREE.Mesh(geometry, material);
  planet.castShadow = true;
  planet.receiveShadow = true;

  planet.position.x = distance;
  orbit.add(planet);
  return { orbit, planet, orbitSpeed };
}

const planets = [];

//mercury
const mercury = createPlanet({
  radius: 0.4,
  map: mercuryTexture,
  distance: 8,
  orbitSpeed: 0.002,
  scene
});
planets.push(mercury);

//venus
const venus = createPlanet({
  radius: 0.6,
  map: venusTexture,
  distance: 10.5,
  orbitSpeed: 0.0015,
  scene
});
planets.push(venus);

//earth
const earth = createPlanet({
  radius: 1,
  map: earthTexture,
  distance: 14,
  orbitSpeed: 0.001,
  scene
});
planets.push(earth);

//mars
const mars = createPlanet({
  radius: 0.8,
  map: marsTexture,
  distance: 18,
  orbitSpeed: 0.0008,
  scene
});
planets.push(mars);

//jupiter
const jupiter = createPlanet({
  radius: 2,
  map: jupiterTexture,
  distance: 23,
  orbitSpeed: 0.0005,
  scene
});
planets.push(jupiter);

//saturn
const saturn = createPlanet({
  radius: 1.5,
  map: saturnTexture,
  distance: 29,
  orbitSpeed: 0.0004,
  scene
});
planets.push(saturn);

//uranus
const uranus = createPlanet({
  radius: 1.7,
  map: uranusTexture,
  distance: 35,
  orbitSpeed: 0.0003,
  scene
});
planets.push(uranus);

//neptune
const neptune = createPlanet({
  radius: 1.8,
  map: neptuneTexture,
  distance: 42,
  orbitSpeed: 0.0002,
  scene
});
planets.push(neptune);

function animate() {
  requestAnimationFrame(animate);

  for (let i = 0; i < planets.length; i++) {
    planets[i].orbit.rotation.y += planets[i].orbitSpeed;
  }


  renderer.render(scene, camera);
}

animate();
