
//setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 1000 );


scene.add( new THREE.AmbientLight( 0x555555 ) );

const light = new THREE.SpotLight( 0xffffff, 1 );
light.position.set( 0, 0.2, CAMERA_Z );
scene.add( light );


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#gameCanvas"),
  alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth- 50, window.innerHeight -50)
renderer.render( scene, camera)