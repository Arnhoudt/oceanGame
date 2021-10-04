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