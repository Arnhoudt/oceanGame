let gameEntities = []
camera.position.y = 0.1
let score
let oxygen
let gameActive = false
const $score = document.querySelector("#score")
const $oxygenDepletion = document.querySelector("#oxygen_depletion")

const restart = () =>{
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

