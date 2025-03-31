//scene
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(7, 7, 0);
camera.lookAt(0, 5, 0);
 

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(width, height);
renderer.antialias = true;
document.body.appendChild(renderer.domElement);
renderer.shadowMapEnabled = true;

//light
//const ceilingLight = new THREE.PointLight(0xFFFFFF, 1);
//ceilingLight.position.set(0, 5.5, 0);
//ceilingLight.castShadow = true;
//scene.add(ceilingLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);


//gui

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
const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture, side: THREE.DoubleSide});
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

//room -- walls
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(3, 1);
const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.DoubleSide});
const wallGeometry = new THREE.PlaneGeometry(20, 10);

const back_Wall = new THREE.Mesh(wallGeometry, wallMaterial);
back_Wall.position.set(0, 5, -10);
scene.add(back_Wall);

const left_Wall = back_Wall.clone();
left_Wall.rotation.y = Math.PI / 2;
left_Wall.position.set(-10, 5, 0);
scene.add(left_Wall);

const right_Wall = left_Wall.clone();
right_Wall.position.set(10, 5, 0);
scene.add(right_Wall);

const front_Wall = back_Wall.clone();
back_Wall.position.set(0, 5, 10);
scene.add(front_Wall);

//room -- ceiling
const ceiling = floor.clone();
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, 10, 0);
scene.add(ceiling);

//rug
const rugGeometry = new THREE.PlaneGeometry(8, 10);
const rugMaterial = new THREE.MeshStandardMaterial({ map: rugTexture});
const rug = new THREE.Mesh(rugGeometry, rugMaterial);
rug.rotation.x = -Math.PI / 2;
rug.position.y = 0.1;
scene.add(rug);

//table
const tableTop_shape = new THREE.Shape();
tableTop_shape.moveTo(0, 0);
tableTop_shape.lineTo(0, 1);
tableTop_shape.lineTo(2, 1);
tableTop_shape.lineTo(2, 0);
tableTop_shape.lineTo(0, 0);

const tableTop_extrudeSettings = {
  steps: 2,
  depth: 0.15,
  bevelEnabled: false,
};

const tableTop_geo = new THREE.ExtrudeGeometry(tableTop_shape, tableTop_extrudeSettings);
const tableTop_mat = new THREE.MeshStandardMaterial({ map: tableTexture });
const tableTop = new THREE.Mesh(tableTop_geo, tableTop_mat);
tableTop.rotation.x = -Math.PI / 2;
tableTop.rotation.z = -Math.PI / 2;
tableTop.position.set(-3, 3, -4);
tableTop.scale.set(4, 6, 2);
scene.add(tableTop);

const legGeo = new THREE.BoxGeometry(0.25, 2.85, 0.2);
const legMat = new THREE.MeshStandardMaterial({ color: "brown" });

const bottomLeft_leg = new THREE.Mesh(legGeo, legMat);
bottomLeft_leg.position.set(2.87, 1.65, 3.89);
scene.add(bottomLeft_leg);

const bottomRight_leg = bottomLeft_leg.clone();
bottomRight_leg.position.set(2.87, 1.65, -3.89);
scene.add(bottomRight_leg);

const topLeft_leg = bottomLeft_leg.clone();
topLeft_leg.position.set(-2.87, 1.65, 3.89);
scene.add(topLeft_leg);

const topRight_leg = topLeft_leg.clone();
topRight_leg.position.set(-2.87, 1.65, -3.89);
scene.add(topRight_leg);

//standing lamp
const modelLoader = new THREE.GLTFLoader();
modelLoader.load('./model_textures/', function(gltf){
  const standingLamp = gltf.scene;
  scene.add(standingLamp);
});

//ceiling lamp

//creation
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();