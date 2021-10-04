// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let canvas

function setup() {
  canvas = createCanvas(RECORDER_WIDTH, RECORDER_HEIGHT);
  canvas.elt.classList.add("screenCanvas0")
  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function(results) {
    poses = results;
  });
  video.hide();
}

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  if(poses.length != 0){
    chestWidth = poses[0]['pose']['leftShoulder']['x'] - poses[0]['pose']['rightShoulder']['x']
    center = poses[0]['pose']['rightShoulder']['x'] + chestWidth / 2
    shoulderHeight = poses[0]['pose']['leftShoulder']['y']

    camera.position.y = (-shoulderHeight/RECORDER_HEIGHT+0.5) * MOVEMENT_SENSITIVITY
    camera.position.x = (-center/RECORDER_WIDTH+0.5) * MOVEMENT_SENSITIVITY
  }
  drawKeypoints();
  // drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
const showScreen = screenIndex => {
    document.querySelectorAll(".screen").forEach($screen => {
        if($screen.classList.contains(`screen${screenIndex}`)){
            $screen.classList.remove("hidden")
        }else{
            $screen.classList.add("hidden")
        }
        const canvas = document.querySelector("#defaultCanvas0")

        canvas.className.split(" ").forEach(item=>{
            if(item.startsWith("screen")){
                canvas.classList.remove(item)
            }
        })
        canvas.classList.add(`screenCanvas${screenIndex}`)
    })
}

document.querySelector("#startDive").addEventListener('click', () =>{ showScreen(1)})
document.querySelector("#doneCalibration").addEventListener('click', () =>{
    restart()
    animate()
    showScreen(2)
})
document.querySelector("#restart").addEventListener('click', () =>{
    restart()
    animate()
    showScreen(2)
})
const CAMERA_Z = 10
const RECORDER_WIDTH = 320
const RECORDER_HEIGHT = 240
const MOVEMENT_SENSITIVITY = 1

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

window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
const updateTrainState = train => {
    train['three'].position.z += 0.01 + score / 500000
    if(train['three'].position.z >= CAMERA_Z + 1){
        train["scene"].remove(train["three"])
        return "remove"
    }
    return 1
}

const trainHits = (train, object) => {
    let distance = new THREE.Vector3()
    distance.subVectors(train["three"]["position"], object["position"])
    distance.x = Math.abs(distance.x)
    distance.y = Math.abs(distance.y)
    return(Math.abs(distance.z)<=0.05 && Math.abs(distance.y)<=0.05 && Math.abs(distance.x)<=0.05)
}

const createTrain = scene =>{
    const texture = new THREE.TextureLoader().load( 'bubble.png' );
    const mat = new THREE.MeshLambertMaterial( {map: texture, transparent: true} );
    const geo = new THREE.PlaneBufferGeometry(0.1,0.1)
    const train = new THREE.Mesh(geo, mat)
    
    train.position.x = Math.random() * 0.4 - 0.2
    train.position.y = Math.random() * 0.4 - 0.2
    scene.add( train );
    return {"updateState":updateTrainState, "hits":trainHits, "scene": scene, "three": train}
}
let gameEntities = []
camera.position.y = 0.1
let score
let oxygen
let gameActive = false
const $score = document.querySelector("#score")
const $oxygenDepletion = document.querySelector("#oxygen_depletion")

const restart = () =>{
  gameEntities.forEach(gameEntity => {
    scene.remove(gameEntity["three"])
  })
  gameEntities = []
  score = 0
  oxygen = 8000
  gameActive = true
}

const animate = () => {
  score += 1 + score / 5000
  oxygen -= 2 + score/10000
  if(oxygen<=0){
    document.querySelector("#gameOver_score").textContent = Math.floor(score/50)
    gameActive = false
    showScreen(3)
  }
  $oxygenDepletion.style.height = `${80 - oxygen/100}vh`
  $score.textContent = `${Math.floor(score/50)} meter`
  gameEntities.forEach((gameEntity, index) => {
    const response = gameEntity['updateState'](gameEntity)
    if(response == "remove")
      gameEntities.splice(index, 1)
    if(gameEntity.hits(gameEntity, camera)){
      gameEntities.splice(index, 1)
      if(oxygen <= 7000){
        oxygen += 1000
      }else{
        oxygen = 8000
      }
    }
  })

  renderer.render(scene, camera)
  if(gameActive)
    requestAnimationFrame(animate)
}

setInterval(()=>{
  if(gameEntities.length < 100 && gameActive){ // Prevents crashes caused by unexpected behaviour related to the browser background tasks
      for(let i = 0; i < 1; i++){
          gameEntities.push(createTrain(scene))
      }
  }
},1000)

camera.position.z = CAMERA_Z;

