let gameEntities = []
camera.position.y = 0.1
let score = 0
let oxygen = 800
let gameActive = true
const $score = document.querySelector("#score")
const $oxygenDepletion = document.querySelector("#oxygen_depletion")

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
camera.position.z = CAMERA_Z;

