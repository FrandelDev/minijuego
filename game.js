const canvas = document.querySelector('#game')
const btnUp = document.querySelector('#up')
const btnLeft = document.querySelector('#left')
const btnRight = document.querySelector('#right')
const btnDown = document.querySelector('#down')
const livesCounter = document.querySelector('#lives')
const timeCounter = document.querySelector('#time')
const record = document.querySelector('#record')
const consoleShip = document.querySelector('#consoleShip')


const game = canvas.getContext('2d')

let canvasSize
let elementSize
let level = 0
let lives = 3
let timeStart
let timeInterval
let obstacles
let collitions =[]
let msg
let finish

let asteroide = new Image()
  asteroide.src = 'img/meteorito.png'
  let asteroide2 = new Image()
  asteroide2.src = 'img/meteorito_invertido.png'
  let asteroide3 = new Image()
  asteroide3.src = 'img/meteorito2.png'
  let asteroide4 = new Image()
  asteroide4.src = 'img/meteorito2_invertido.png'



const playerPosition ={
    x: undefined,
    y: undefined
}
const goalPosition ={
  x: undefined,
  y: undefined
}


//-----EVENTS-----
window.addEventListener('load',setCanvasSize)
window.addEventListener('resize',setCanvasSize)
window.addEventListener('keydown',moveByKeys)
// btnUp.addEventListener("click", moveUp);
// btnLeft.addEventListener("click", moveLeft);
// btnRight.addEventListener("click", moveRight);
// btnDown.addEventListener("click", moveDown);

//------RENDER------
function startGame(){
 
   obstacles = []
   record.innerHTML = localStorage.getItem('record_time')
    game.font = `${elementSize}px verdana`
    showLives()
    let mapToRender = maps[level]
    if(!mapToRender){
      console.log('GAME OVER')
      gameOver()
      return;
    } 
 
    let splittedMap = mapToRender.match(/[OXI\-]+/g).map(row => row.split(''))
    game.clearRect(0,0,canvasSize,canvasSize)
    splittedMap.forEach((row,rowIndex) => {
        row.forEach((column,columnIndex)=>{
            let posX = elementSize *(columnIndex+1)
            let posY = elementSize *(rowIndex+1)
          
          game.fillText(emojis[column],posX,posY)
            if(column === 'O'){
              if(!playerPosition.y && !playerPosition.x){
                playerPosition.x = posX
                playerPosition.y = posY
                
              }
                
            }
            if(column === 'I'){
              goalPosition.x = posX
              goalPosition.y = posY  
            }
            if(column === 'X'){
              obstacles.push({x:posX,y:posY})
            }
        })
      });
      if(goalPosition.x.toFixed() == playerPosition.x.toFixed() && goalPosition.y.toFixed() == playerPosition.y.toFixed() && level == maps.length-1){
       
        finish = true
      }
     //console.log(playerPosition)
      collitions.forEach(collision =>{
        game.fillText(emojis['COLLISION'],collision.x,collision.y)
      })
      movePlayer()
      
}
function setCanvasSize(){
    canvasSize = window.innerHeight > window.innerWidth 
    ? window.innerWidth*0.8 : window.innerHeight *0.8
    
    elementSize = (canvasSize/13)-1.5
     
     canvas.setAttribute('width',canvasSize-20)
    canvas.setAttribute('height',canvasSize)
    playerPosition.x = undefined
    playerPosition.y = undefined
     startGame()
    msg = `Hola tú, viajero interdimencional, espero recibas este mensaje, es que ¡Necesito tu Ayuda!
  Tengo que llegar lo mas pronto posible a mi planeta natal ya que corre peligro. ¡Vamos no hay tiempo que perder!.
    `
    typeWriter() 
}
let i =0
let msgFlag
function typeWriter(){
  
  if(i === 0) consoleShip.innerHTML = ""; msgFlag = false
  if(i < msg.length){
    consoleShip.innerHTML += msg.charAt(i)
    i++
    setTimeout(typeWriter,50)
  }
}
let newMsgFlag = false
function newMsg(messageMaker){
  return function(...args){
    if(!newMsgFlag){
      newMsgFlag =true
      return messageMaker(...args)
    }
  }
}
//-----BUTONS----
function moveByKeys(event){

 (newMsg(()=>{
    i =0
    msg ='Adelantee!! pero por favor no estrelles mi nave :)'
  typeWriter()
  }))()

    let key = event.key;
if(finish){
  return;
}
    switch (key) {
      case "ArrowUp":
        moveUp();
        break;
  
      case "ArrowDown":
        moveDown();
        break;
  
      case "ArrowLeft":
        moveLeft();
        break;
  
      case "ArrowRight":
      moveRight();
        break;
  
      default:
        break;
    }
}

function moveUp() {
    if((playerPosition.y - elementSize) < 0){
      return null
    }
    else{
      playerPosition.y -= elementSize
    startGame()
    starInterval()
    }
    
}

function moveLeft() {
  if((playerPosition.x -elementSize) < 30){
    return null
  }
  else{

    playerPosition.x -= elementSize
    startGame()
    starInterval()
  }
}

function moveRight() {
  if(playerPosition.x > canvasSize-elementSize){
    return null
  }
  else{
    playerPosition.x += elementSize
    startGame()
    starInterval()
  }
  
}

function moveDown() {
  if((playerPosition.y + elementSize) > canvasSize){
    return null
  }
  else{
    playerPosition.y += elementSize
  startGame()
  starInterval()
  }
}
function movePlayer(){
  const msgCollisions = ['¡Oye! esta nave es muy cara!!','Creo averte dicho que no estrelles mi nave!!',
  'Uhggrrr!! Estos meteoritos!!!','Quiero seguir viviendo >:[','Evitalos a toda costa, no tenemos todo el dia. Bueno... en el espacio no existe el dia... Tu me entiendes XD']
  let randomNumber = Math.floor(Math.random()*msgCollisions.length)
  const goalPositionX = goalPosition.x.toFixed() == playerPosition.x.toFixed()
  const goalPositionY = goalPosition.y.toFixed() == playerPosition.y.toFixed()

 obstacles.forEach(obstacle => {
    let obstaclePosX = obstacle.x.toFixed() == playerPosition.x.toFixed()
    let obstaclesPosY = obstacle.y.toFixed() == playerPosition.y.toFixed()

    if(obstaclePosX && obstaclesPosY){
      collitions.push({x:obstacle.x, y:obstacle.y})
      i =0
    msg = msgCollisions[randomNumber]
  typeWriter()
     levelFailed()
      
    }
  }
  ) 
  

  if(goalPositionX && goalPositionY){
    levelUp()
  }
 
 game.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y)
}
function levelFailed(){
  lives--
  if(lives === 0){
    level = 0
    lives = 3
    timeStart = undefined
    collitions= []
    i =0
    msg =`¡Vaya! estos asteroides son demasiado molestos, ¿lo intentamos otra vez?`
  typeWriter()
  }
  playerPosition.x = undefined
  playerPosition.y = undefined
 startGame()
}
 function levelUp(){
  level++
   
  if(level == maps.length-1){
    emojis['I'] = emojis['PLANET']
    i =0
    msg ='¡Mira! ya podemos ver mi hogar dulce hogar pero hay asteroides por doquier ¡esto es un caos! cuidado ahi vieenen!!'
  typeWriter()
 
  }
  
 else if(level == 1){
  i =0
    msg ='Esto apenas Comienza jajaj'
  typeWriter()
 }else if (level >1 && level < maps.length-1){
  i =0
    msg ='¡Sigamos no te rindas!'
  typeWriter()
 }
    
  playerPosition.x = undefined
  playerPosition.y = undefined
  collitions = []
  startGame()
 }
 function gameOver(){
  level = 0
  collitions = []
  if(finish){
    clearInterval(timeInterval)
    showRecord()
    game.clearRect(0,0,canvasSize,canvasSize)
    
    game.textAling = 'center'
    game.font = `${canvasSize/4}px verdana`
    game.fillText('🪐',canvasSize/3,canvasSize/2)
    game.drawImage(asteroide,canvasSize/3,canvasSize/4)
    game.drawImage(asteroide,canvasSize/5,canvasSize/3)
    game.drawImage(asteroide2,canvasSize/2,canvasSize/5)
    game.drawImage(asteroide2,canvasSize/1.5,canvasSize/4)
    game.drawImage(asteroide3,canvasSize/3,canvasSize/2)
    game.drawImage(asteroide3,canvasSize/5,canvasSize/2)
    game.drawImage(asteroide4,canvasSize/2,canvasSize/2)
    game.drawImage(asteroide4,canvasSize/1.5,canvasSize/2)
    game.fillText('🛸',canvasSize/3,canvasSize/1.3)

    i =0
    msg =`¡Good job! Muchas Gracias me has traido de vuelta a casa, pero... Que es Esooo!!! 
    se aproximan muchos metr..ritos  a...yuda AA..aahH!!! ..............................  ¡Salva..te!   .......................    .............................`
  typeWriter()
 let crazyend= setTimeout(setInterval(()=> {
    lives--
    showLives()
  },4000),8000)
  setTimeout(()=>{
    clearInterval(crazyend)
    location.reload()},25000)
}

  clearInterval(timeInterval)
  showRecord()
 }
 function showLives(){
  livesCounter.innerHTML = emojis['HEART'].repeat(lives)
 }
 function showTime(){
  timeCounter.innerHTML = Date.now() - timeStart
 }
 function showRecord(){
  
const currentRecord = localStorage.getItem('record_time')
  const playerTime = Date.now() - timeStart

  if(currentRecord){
    if(currentRecord >= playerTime){
      localStorage.setItem('record_time',playerTime)
      record.innerHTML = localStorage.getItem('record_time')
      console.innerHTML = 'RECORD SUPERADO'
    }
    else{
      console.innerHTML = 'RECORD NO SUPERADO'
    }
  }
  else{
    localStorage.setItem('record_time',playerTime)
    record.innerHTML = localStorage.getItem('record_time')
    console.innerHTML = 'Primera vez? Ahora trata de superar este tiempo'
  }
 }
 function starInterval(){
  if(!timeStart){
    timeStart = Date.now()
    timeInterval = setInterval(showTime,100)
  }
 }