//scene
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(13, 9, 0);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(width, height);
renderer.antialias = true;
document.body.appendChild(renderer.domElement);

//light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const ceilingLight = new THREE.PointLight(0xfff4cc, 1.5, 20);
ceilingLight.position.set(0, 8, 0);
ceilingLight.castShadow = true;
ceilingLight.visible = false;
scene.add(ceilingLight);

const standingLampLight = new THREE.PointLight(0x0000ff, 2, 30);
standingLampLight.position.set(-8.7, 7.3, 8);
standingLampLight.castShadow = true;
standingLampLight.visible = false;
scene.add(standingLampLight);

// gui
const gui = new dat.GUI();

const lightSettings = {
  'Ceiling Light': false,
  'Standing Lamp': false
};

gui.add(lightSettings, 'Ceiling Light').onChange((value) => {
  ceilingLight.visible = value;
});

gui.add(lightSettings, 'Standing Lamp').onChange((value) => {
  standingLampLight.visible = value;
});

//orbit
const orbital = new THREE.OrbitControls(camera, renderer.domElement);
orbital.update()

// texture loader
const textureLoader = new THREE.TextureLoader();

// Load textures
const floorTexture = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/granite_tile.png?height=760');
const wallTexture = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/medieval_blocks_03.png?height=760');
const rugTexture = textureLoader.load('https://acg-media.struffelproductions.com/file/ambientCG-Web/media/thumbnail/2048-JPG-242424/Carpet006.jpg');
const tableTexture = textureLoader.load('https://cdn.polyhaven.com/asset_img/primary/wood_table_001.png?height=760');

//room -- floor
const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture, side: THREE.DoubleSide });
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

//room -- walls
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(3, 1);
const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.DoubleSide });
const wallGeometry = new THREE.PlaneGeometry(20, 10);

const right_Wall = new THREE.Mesh(wallGeometry, wallMaterial);
right_Wall.position.set(0, 5, -10);
scene.add(right_Wall);

const left_Wall = right_Wall.clone();
left_Wall.position.set(0, 5, 10);
scene.add(left_Wall);

const front_Wall = right_Wall.clone();
front_Wall.rotation.y = Math.PI / 2;
front_Wall.position.set(-10, 5, 0);
scene.add(front_Wall);

const back_Wall = front_Wall.clone();
back_Wall.position.set(10, 5, 0);
//scene.add(back_Wall);

//room -- ceiling
const ceiling = floor.clone();
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, 10, 0);
scene.add(ceiling);

//rug
const rugGeometry = new THREE.PlaneGeometry(8, 10);
const rugMaterial = new THREE.MeshStandardMaterial({ map: rugTexture });
const rug = new THREE.Mesh(rugGeometry, rugMaterial);
rug.rotation.x = -Math.PI / 2;
rug.position.y = 0.1;
rug.receiveShadow = true;
scene.add(rug);

//table
tableTexture.wrapS = THREE.RepeatWrapping;
tableTexture.wrapT = THREE.RepeatWrapping;
tableTexture.repeat.set(3, 1);
const tableTop_shape = new THREE.Shape();
tableTop_shape.moveTo(0, 0);
tableTop_shape.lineTo(0, 1);
tableTop_shape.lineTo(2, 1);
tableTop_shape.lineTo(2, 0);
tableTop_shape.lineTo(0, 0);

const tableTop_extrudeSettings = {
  steps: 2,
  depth: 0.3,
  bevelEnabled: false,
};

const tableTop_geo = new THREE.ExtrudeGeometry(tableTop_shape, tableTop_extrudeSettings);
const tableTop_mat = new THREE.MeshStandardMaterial({ map: tableTexture });
const tableTop = new THREE.Mesh(tableTop_geo, tableTop_mat);
tableTop.rotation.x = -Math.PI / 2;
tableTop.rotation.z = -Math.PI / 2;
tableTop.position.set(-3, 3, -4);
tableTop.scale.set(4, 6, 2);
tableTop.receiveShadow = true;
tableTop.castShadow = true;
//scene.add(tableTop);

const legGeo = new THREE.BoxGeometry(0.25, 2.85, 0.2);
const legMat = new THREE.MeshStandardMaterial({ color: "brown" });

const bottomLeft_leg = new THREE.Mesh(legGeo, legMat);
bottomLeft_leg.position.set(2.87, 1.65, 3.89);
bottomLeft_leg.receiveShadow = true;
//scene.add(bottomLeft_leg);

const bottomRight_leg = bottomLeft_leg.clone();
bottomRight_leg.position.set(2.87, 1.65, -3.89);
bottomRight_leg.receiveShadow = true;
//scene.add(bottomRight_leg);

const topLeft_leg = bottomLeft_leg.clone();
topLeft_leg.position.set(-2.87, 1.65, 3.89);
topLeft_leg.receiveShadow = true;
//scene.add(topLeft_leg);

const topRight_leg = topLeft_leg.clone();
topRight_leg.position.set(-2.87, 1.65, -3.89);
topRight_leg.receiveShadow = true;
//scene.add(topRight_leg);

const table = new THREE.Group();
table.add(tableTop);
table.add(bottomLeft_leg);
table.add(bottomRight_leg);
table.add(topLeft_leg);
table.add(topRight_leg);
scene.add(table);

//model loader
const modelLoader = new THREE.GLTFLoader();

//standing lamp
modelLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/3D%20Model%20Room/models_textures/Lamp%20Round%20Floor.glb', function (gltf) {
  const standingLamp = gltf.scene;
  standingLamp.scale.set(10, 10, 10);
  standingLamp.position.set(-8.4, 0.1, 8)
  scene.add(standingLamp);

});

//ceiling lamp
modelLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/3D%20Model%20Room/models_textures/Light%20bulb.glb', function (gltf) {
  const ceilingLamp = gltf.scene;
  ceilingLamp.scale.set(0.4, 0.4, 0.4);
  ceilingLamp.position.set(0, 8, 0)
  scene.add(ceilingLamp);
});

// duck model
modelLoader.load('https://raw.githubusercontent.com/ladybug-tools/3d-models/refs/heads/master/gltf-sample-files/2021/Duck1.gltf', function (gltf) {
  const duck = gltf.scene;
  duck.scale.set(0.01, 0.01, 0.01);
  duck.position.set(0, 3.5, 2)
  scene.add(duck);

  duck.traverse((child) => {
    if (child.isMesh)
      child.castShadow = true;
  });

});

//gun model
modelLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/3D%20Model%20Room/models_textures/Pistol.glb', function (gltf) {
  const pistol = gltf.scene;
  pistol.scale.set(1, 1, 1);
  pistol.rotation.x = -Math.PI / 2;
  pistol.position.set(0, 3.75, 0)

  pistol.traverse((child) => {
    if (child.isMesh)
      child.castShadow = true;
  });
  scene.add(pistol);
});

//board model
modelLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/3D%20Model%20Room/models_textures/Wall%20Corkboard.glb', function (gltf) {
  const board = gltf.scene;
  board.scale.set(9.8, 9.8, 9.8);
  board.rotation.y = Math.PI / 2;
  board.position.set(-9.85, 3.75, 0)

  board.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material && child.material.metalness !== undefined) {
        child.material.metalness = 0;
        child.material.roughness = 1; // matte look, less glare
      }
    }
  });

  scene.add(board);
});


//blood model
modelLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/3D%20Model%20Room/models_textures/Blood%20Splat.glb', function (gltf) {
  const blood = gltf.scene;
  blood.scale.set(1, 1, 1);
  blood.position.set(0.75, 3.6, -1.25)

  blood.traverse((child) => {
    if (child.isMesh)
      child.castShadow = true;
  });
  scene.add(blood);
});

//paint
modelLoader.load('https://raw.githubusercontent.com/StudentKC-jpg/Computer-Graphics/main/3D%20Model%20Room/models_textures/Paint%20Bucket.glb', function (gltf) {
  const paint = gltf.scene;
  paint.scale.set(15, 15, 15);
  paint.position.set(-8.4, 0.1, -8)
  scene.add(paint);

  const paintCopy1 = paint.clone();
  paintCopy1.position.set(-6.4, 0.1, -8);
  scene.add(paintCopy1);

  const paintCopy2 = paint.clone();
  paintCopy2.position.set(-6.9, 0.1, -6);
  scene.add(paintCopy2);

});

//creation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();