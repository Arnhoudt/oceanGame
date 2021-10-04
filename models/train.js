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