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
    animate()
    setInterval(()=>{
        if(gameEntities.length < 100){ // Prevents crashes caused by unexpected behaviour related to the browser background tasks
        for(let i = 0; i < 1; i++){
            gameEntities.push(createTrain(scene))
        }
        }
    },1000)
    showScreen(2)
})
