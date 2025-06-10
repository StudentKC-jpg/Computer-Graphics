//scene
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); 

//camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0, 15, 23);
camera.lookAt(0, 10, 0);

//cube camera
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
  format: THREE.RGBAFormat,
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter,
});

cubeRenderTarget.texture.mapping = THREE.CubeRefractionMapping;

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
scene.add(cubeCamera);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(width, height);
renderer.antialias = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
document.body.appendChild(renderer.domElement);

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.90);
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;
directionalLight.castShadow = true;
scene.add(directionalLight);

// gui
const settings = {
  timeOfDay: 0
};

const gui = new dat.GUI();
gui.add(settings, 'timeOfDay', 0, 1).step(0.01).name('Time of Day');

function updateLighting() {
  const time = settings.timeOfDay;

  const skyColor = new THREE.Color().lerpColors(
    new THREE.Color(0x89cff0), 
    new THREE.Color(0xffa070), 
    time
  );

  const ambientColor = new THREE.Color().lerpColors(
    new THREE.Color(0xffffff),
    new THREE.Color(0xffddb0),
    time
  );

  const sunColor = new THREE.Color().lerpColors(
    new THREE.Color(0xffffff),
    new THREE.Color(0xff7733),
    time
  );
  
  scene.background = skyColor;
  ambientLight.color = ambientColor;
  directionalLight.color = sunColor;

  ambientLight.intensity = 0.5 - 0.3 * time; 
  directionalLight.intensity = 1.0 - 0.5 * time;
  
  
  const sunX = 15 - 30 * time;   
  const sunY = 15;     

  directionalLight.position.set(sunX, sunY, 10);
  directionalLight.target.position.set(0, 3, 0);
  directionalLight.target.updateMatrixWorld();
}

//orbit
const orbital = new THREE.OrbitControls(camera, renderer.domElement);
orbital.update()

document.addEventListener('keydown', (event) => {
  
  switch(event.key) {
    case 'ArrowLeft':
      camera.position.x -= 0.05 * 8;
      break;
    case 'ArrowRight':
      camera.position.x += 0.05 * 8;
      break;
    case 'ArrowUp':
      camera.position.y += 0.05 * 8;
      break;
    case 'ArrowDown':
      camera.position.y -= 0.05 * 8;
      break;
    case '=':
    case '+':
      camera.position.z -= 1;
      break;
    case '-':
    case '_':
      camera.position.z += 1;
      break;
  }
  
  camera.lookAt(0, 10, 0);
  orbital.update();
});

// texture loader
const textureLoader = new THREE.TextureLoader();

//texture
const floorTexture = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/wood_table_001.png?height=760');
const wallTexture = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/wood_table_001.png?height=760');
const baseTexture = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/wood_plank_wall.png?height=760');
const snowflakeTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/snowflake1.png');

//floor
const floorGeo = new THREE.PlaneGeometry(40, 40);
const floorMat = new THREE.MeshStandardMaterial({   map: floorTexture, side: THREE.DoubleSide
});

const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);
scene.add(floor);

//wall
const wallGeo = new THREE.PlaneGeometry(40, 20);
const wallMat = new THREE.MeshStandardMaterial({
  map: wallTexture, side: THREE.DoubleSide });
const wall = new THREE.Mesh(wallGeo, wallMat);
wall.position.z = -20;
wall.position.y = 10;
wall.receiveShadow = true;
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(4, 4);
scene.add(wall);

//snow globe -- base
const baseGeo = new THREE.CylinderGeometry(3, 6, 6, 32);
const baseMat = new THREE.MeshStandardMaterial({
  map: baseTexture,
});

const base = new THREE.Mesh(baseGeo, baseMat);
base.position.y = 3.01;
base.castShadow = true;
baseTexture.wrapS = THREE.RepeatWrapping;
baseTexture.wrapT = THREE.RepeatWrapping;
baseTexture.repeat.set(4, 4);
scene.add(base);

//snow globe -- glass ball
const globeGeo = new THREE.SphereGeometry(5, 32, 32);
const globeMat = new THREE.MeshPhongMaterial({
    shininess: 100, 
    color: "white", 
    specular: "white", 
    envMap: cubeRenderTarget.texture, 
    refractionRatio: 0.1, 
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
    combine: THREE.MixOperation 
});

const globe = new THREE.Mesh(globeGeo, globeMat);
globe.position.y = 10;
globe.castShadow = true;
scene.add(globe);

//snow ground
const snowBaseMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 1,
  metalness: 0,
  side: THREE.DoubleSide
});

const snowGroundGeo = new THREE.SphereGeometry(5, 48, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
const snowGround = new THREE.Mesh(snowGroundGeo, snowBaseMat);
snowGround.position.set(0, 8.95, 0);
scene.add(snowGround);

const snowBaseGeo = new THREE.CircleGeometry(5, 64);
const snowBase = new THREE.Mesh(snowBaseGeo, snowBaseMat);
snowBase.rotation.x = -Math.PI / 2;
snowBase.position.set(0, 8.9, 0);   
scene.add(snowBase);

//snowman
const snowmanGroup = new THREE.Group();

//snow bottom
const snow_bottom_geo = new THREE.SphereGeometry(4, 16, 16);
const snow_bottom_mat = new THREE.MeshStandardMaterial({ color: 0xffffff});
const snow_bottom = new THREE.Mesh(snow_bottom_geo, snow_bottom_mat);
snow_bottom.castShadow = true;
snow_bottom.position.y = 1;  
snowmanGroup.add(snow_bottom);

//snow middle
const snow_middle_geo = new THREE.SphereGeometry(3, 16, 16);
const snow_middle_mat = new THREE.MeshStandardMaterial({color: 0xffffff});
const snow_middle = new THREE.Mesh(snow_middle_geo, snow_middle_mat);
snow_middle.castShadow = true;
snow_middle.position.y = 6.75;     
snowmanGroup.add(snow_middle);

//snow top
const snow_top_geo = new THREE.SphereGeometry(2, 16, 16);
const snow_top_mat = new THREE.MeshStandardMaterial({color: 0xffffff});
const snow_top = new THREE.Mesh(snow_top_geo, snow_top_mat);
snow_top.castShadow = true;
snow_top.position.y = 11;        
snowmanGroup.add(snow_top);

//snow eyes
const eyeGeo = new THREE.SphereGeometry(0.2, 8, 8);
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000});

const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(-0.75, 11.65, 1.7);
snowmanGroup.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
rightEye.position.set(0.75, 11.65, 1.7);
snowmanGroup.add(rightEye);

//nose
const noseGeo = new THREE.ConeGeometry(0.2, 1.5, 16);
const noseMat = new THREE.MeshStandardMaterial({color: 0xff6600});
const nose = new THREE.Mesh(noseGeo, noseMat);
nose.position.set(0, 11.15, 2.5);
nose.rotation.x = Math.PI / 2;
snowmanGroup.add(nose);

// Hat top
const brimGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
const brimMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
const brim = new THREE.Mesh(brimGeo, brimMat);
brim.castShadow = true;
brim.position.set(0, 13, 0);
snowmanGroup.add(brim);

// Hat bottom
const hatTopGeo = new THREE.CylinderGeometry(1, 2.5, 1, 32);
const hatTopMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
const hatTop = new THREE.Mesh(hatTopGeo, hatTopMat);
hatTop.castShadow = true;
hatTop.position.set(0, 12.75, 0);
snowmanGroup.add(hatTop);

snowmanGroup.position.set(0, 9.15, 0);
snowmanGroup.scale.set(0.1, 0.1, 0.1);
scene.add(snowmanGroup);

// A tree
const tree = new THREE.Group();

// Trunk
const treeTrunkGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const treeTrunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
treeTrunk.position.y = 0.5;
tree.add(treeTrunk);

// Lower leaves
const lowerTreeGeo = new THREE.ConeGeometry(1.5, 1.2, 16);
const leavesMat = new THREE.MeshStandardMaterial({ color: 0x006400 });
const lowerTree = new THREE.Mesh(lowerTreeGeo, leavesMat);
lowerTree.position.y = 1.2;
tree.add(lowerTree);

// Middle leaves
const midTreeGeo = new THREE.ConeGeometry(1.1, 1.0, 16);
const midTree = new THREE.Mesh(midTreeGeo, leavesMat);
midTree.position.y = 2;
tree.add(midTree);

// Top leaves
const topTreeGeo = new THREE.ConeGeometry(0.7, 0.8, 16);
const topTree = new THREE.Mesh(topTreeGeo, leavesMat);
topTree.position.y = 2.8;
tree.add(topTree);

tree.position.set(2, 8.9, -1);
tree.scale.set(0.8, 0.8, 0.8);
scene.add(tree);

// a tree clone
const treeClone1 = tree.clone();
treeClone1.position.set(-2, 8.9, 1);
treeClone1.rotation.y = Math.random() * Math.PI * 2;
scene.add(treeClone1);

// another tree clone
const treeClone2 = tree.clone();
treeClone2.position.set(-1.5, 8.9, -2);
treeClone2.scale.set(0.65, 0.65, 0.65);
treeClone2.rotation.y = Math.random() * Math.PI * 2;
scene.add(treeClone2);

//snowfall
let snowflakes;
let positions = [];
let velocities = [];

const numSnowflakes = 400;

const snowfallGeo = new THREE.BufferGeometry();

function addSnowflakes() {
  for (let i = 0; i < numSnowflakes; i++) {
    const radius = Math.random() * 4.8;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.random() * 4 + 11; 
    positions.push(x, y, z);

    velocities.push(
      (Math.random() - 0.5) * 0.02, 
       Math.random() * 0.008 + 0.004, 
      (Math.random() - 0.5) * 0.02 
    );
  }

  snowfallGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  snowfallGeo.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
}

addSnowflakes();

const snowflakeMat = new THREE.PointsMaterial({
  size: 0.25,
  map: snowflakeTexture,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true,
   opacity: 0.7
});

snowfall = new THREE.Points(snowfallGeo, snowflakeMat);
scene.add(snowfall);

function updateSnow() {
  const positions = snowfall.geometry.attributes.position.array;
  const velocities = snowfall.geometry.attributes.velocity.array;

  for (let i = 0; i < numSnowflakes; i++) {
     
    const cc = i * 3;
    positions[cc] += velocities[cc];       
    positions[cc + 1] -= velocities[cc + 1]; 
    positions[cc + 2] += velocities[cc + 2];

    const dx = positions[cc];
    const dy = positions[cc + 1] - 10; 
    const dz = positions[cc + 2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance > 4.8 || positions[cc + 1] < 9) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 4.7;
      positions[cc] = Math.cos(angle) * radius;
      positions[cc + 1] = Math.random() * 3 + 12; 
      positions[cc + 2] = Math.sin(angle) * radius;
    }
  }

  snowfall.geometry.attributes.position.needsUpdate = true;
}


function animate() {
  requestAnimationFrame(animate);
  
  updateLighting();
  updateSnow();
  
  cubeCamera.position.copy(globe.position);
  cubeCamera.update(renderer, scene);
  
  renderer.render(scene, camera);
}
animate();
