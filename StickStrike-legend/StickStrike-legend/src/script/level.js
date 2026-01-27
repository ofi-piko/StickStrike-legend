const player=document.getElementById('player')
const playerLeft=document.getElementById('playerLeft')
const playerRight=document.getElementById('playerRight')
const playerJump=document.getElementById('playerJump')

const leftBtn=document.getElementById('leftBtn')
const rightBtn=document.getElementById('rightBtn')
const jumpBtn=document.getElementById('jumpBtn')

const place=document.querySelector('.place')

let x=100
let jumping=false
let speed=5

function reset(){
    player.classList.remove('active')
    playerLeft.classList.remove('active')
    playerRight.classList.remove('active')
    playerJump.classList.remove('active')
}

function idle(){
    reset()
    player.classList.add('active')
}

function moveLeft(){
    reset()
    playerLeft.classList.add('active')
    x-=speed
    if(x<0)x=0
    updatePos()
}

function moveRight(){
    reset()
    playerRight.classList.add('active')
    x+=speed
    if(x>660)x=660
    updatePos()
}

function jump(){
    if(jumping)return
    jumping=true
    reset()
    playerJump.classList.add('active')
    let y=40
    const up=setInterval(()=>{
        y+=6
        setBottom(y)
        if(y>=140){
            clearInterval(up)
            const down=setInterval(()=>{
                y-=6
                setBottom(y)
                if(y<=40){
                    clearInterval(down)
                    jumping=false
                    idle()
                }
            },20)
        }
    },20)
}

function setBottom(v){
    player.style.bottom=v+'px'
    playerLeft.style.bottom=v+'px'
    playerRight.style.bottom=v+'px'
    playerJump.style.bottom=v+'px'
}

function updatePos(){
    player.style.left=x+'px'
    playerLeft.style.left=x+'px'
    playerRight.style.left=x+'px'
    playerJump.style.left=x+'px'
}

leftBtn.onmousedown=moveLeft
rightBtn.onmousedown=moveRight
jumpBtn.onclick=jump

document.addEventListener('keydown',e=>{
    if(e.code==='ArrowLeft')moveLeft()
    if(e.code==='ArrowRight')moveRight()
    if(e.code==='Space')jump()
})

idle()

let px=700
setInterval(()=>{
    px-=4
    place.style.right=(700-px)+'px'
    if(px<-60)px=700
    const treeX=px
    if(treeX<140&&treeX>80&&!jumping){
        localStorage.setItem('lastGame','lose')
        location.reload()
    }
},20)