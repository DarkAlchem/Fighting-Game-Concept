const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width=1020;
canvas.height=576;

c.fillRect(0,0, canvas.width, canvas.height);
const gravity = 0.7,
      jumppow = 18;
let hitstop = 0;

const background = new Sprite({
        position:{
            x:0,
            y:0
        },
        imageSrc: './img/background.png'
      })

const shop = new Sprite({
        position:{
            x:400,
            y:139
        },
        imageSrc: './img/shop_anim.png',
        scale:2.75,
        framesMax:6
      })

const player = new Fighter({
    position:{
        x:250,
        y:0
    },
    velocity:{
        x:0,
        y:0
    },
    imageSrc: './img/samurai/Idle.png',
    framesMax:8,
    scale:2.5,
    offset:{
        x:215,
        y:155
    },
    sprites:{
        idle:{
            imageSrc: './img/samurai/Idle.png',
            framesMax:8
        },
        run:{
            imageSrc: './img/samurai/Run.png',
            framesMax:8,
        },
        jump:{
            imageSrc: './img/samurai/Jump.png',
            framesMax:2,
        },
        fall:{
            imageSrc: './img/samurai/Fall.png',
            framesMax:2,
        },
        attacka:{
            imageSrc: './img/samurai/Attack1.png',
            framesMax:6,
        },
        damaged:{
            imageSrc: './img/samurai/Take Hit - white silhouette.png',
            framesMax:4,
        },
        feint:{
            imageSrc: './img/samurai/Death.png',
            framesMax:6,
        }
    },
    attackBox:{
        offset:{
            x:80,
            y:20
        },
        width:170,
        height:120
    }
});

const enemy = new Fighter({
    position:{
        x:680,
        y:100
    },
    velocity:{
        x:0,
        y:0
    },
    imageSrc: './img/oni/Idle.png',
    framesMax:8,
    scale:2.5,
    offset:{
        x:215,
        y:169
    },
    sprites:{
        idle:{
            imageSrc: './img/oni/Idle.png',
            framesMax:4
        },
        run:{
            imageSrc: './img/oni/Run.png',
            framesMax:8,
        },
        jump:{
            imageSrc: './img/oni/Jump.png',
            framesMax:2,
        },
        fall:{
            imageSrc: './img/oni/Fall.png',
            framesMax:2,
        },
        attacka:{
            imageSrc: './img/oni/Attack1.png',
            framesMax:4,
        },
        damaged:{
            imageSrc: './img/oni/Take hit.png',
            framesMax:3,
        },
        feint:{
            imageSrc: './img/oni/Death.png',
            framesMax:7,
        }
    },
    attackBox:{
        offset:{
            x:-160,
            y:50
        },
        width:120,
        height:50
    }
})

const keys={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
}

decreaseTimer();

function checkHPBarColor({selector,ratio}){
    let element = document.querySelector(selector),
        rat = ratio * 100;
    element.style.width = rat + '%';
    if (rat == 100) element.style.backgroundColor='#e2cf00';
    if (rat < 100 && rat > 50) element.style.backgroundColor='#00d50f';
    if (rat <= 50 && rat >= 25) element.style.backgroundColor='#e7880d';
    if (rat < 25) element.style.backgroundColor='#c80009';
}

function updateLoop(){
    window.requestAnimationFrame(updateLoop);
    c.fillStyle='black';
    c.fillRect(0,0,canvas.width,canvas.height);

    background.update();
    shop.update();
    c.fillStyle='rgba(255,255,255,.2)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update(hitstop);
    enemy.update(hitstop);
    if(hitstop>0)hitstop--;

    player.velocity.x=0;
    if(keys.a.pressed && player.lastkey=='a'){
        player.switchSprite('run')
        player.velocity.x=-5;
    } else if(keys.d.pressed && player.lastkey=='d') {
        player.switchSprite('run')
        player.velocity.x=5;
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

    enemy.velocity.x=0;
    if(keys.ArrowLeft.pressed && enemy.lastKey=='ArrowLeft'){
        enemy.switchSprite('run')
        enemy.velocity.x=-5;
    } else if(keys.ArrowRight.pressed && enemy.lastKey=='ArrowRight') {
        enemy.switchSprite('run');
        enemy.velocity.x=5;
    } else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //Detect for Enemy Collision
    if (detectCollision({rectangleA:player,rectangleB:enemy}) && player.isAttacking && player.framesCurrent===4){
        if(hitstop==0){
            enemy.takeHit();
            hitstop=4;
        }
        checkHPBarColor({selector:'#enemyHealth', ratio:enemy.health / enemy.healthMax});
        player.isAttacking=false;
    }

    if (detectCollision({rectangleA:enemy,rectangleB:player}) && enemy.isAttacking && enemy.framesCurrent===1){
        if(hitstop==0){
            player.takeHit();
            hitstop=4;
        }
        checkHPBarColor({selector:'#playerHealth', ratio:player.health / player.healthMax }); 
        enemy.isAttacking=false;
    }

    if (player.isAttacking&&player.framesCurrent==4){
        player.isAttacking=false
    }

    if (enemy.isAttacking&&enemy.framesCurrent==2){
        enemy.isAttacking=false
    }

    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy,timerId})
    }
}

updateLoop();

window.addEventListener('keydown',(e) =>{
    if (!player.feint){
        switch (e.key){ 
            case 'd':
                keys.d.pressed=true
                player.lastkey='d';
            break;
            case 'a':
                keys.a.pressed=true
                player.lastkey='a';
            break;
            case 'w':
                player.velocity.y=-jumppow;
            break;
            case 's':
                player.attack();
            break;
        }
    }

    if (!enemy.feint){
        switch (e.key){ 
            case 'ArrowRight':
                keys.ArrowRight.pressed=true
                enemy.lastKey='ArrowRight';
            break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed=true
                enemy.lastKey='ArrowLeft';
            break;
            case 'ArrowUp':
                enemy.velocity.y=-jumppow;
            break;
            case 'ArrowDown':
                enemy.attack();
            break;
        }
    }
})

window.addEventListener('keyup',(e) =>{
    switch (e.key){ 
        case 'd':
            keys.d.pressed=false
        break;
        case 'a':
            keys.a.pressed=false
        break;
        case 'w':
            //player.velocity.y=-1;
        break;
    }

    switch (e.key){ 
        case 'ArrowRight':
            keys.ArrowRight.pressed=false
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false
        break;
        case 'w':
            //player.velocity.y=-1;
        break;
    }
})