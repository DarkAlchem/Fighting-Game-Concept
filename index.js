const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width=1020;
canvas.height=576;

c.fillRect(0,0, canvas.width, canvas.height);
const gravity = 0.7,
      jumppow = 18;

class Sprite{
    constructor({position,velocity,color='red',offset}){
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.health=500;
        this.healthMax=500;
        this.color = color;
        this.isAttacking=false;
        this.attackBox = {
            position:{
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50 
        }
    }

    draw(){
        c.fillStyle=this.color;
        c.fillRect(this.position.x,this.position.y,this.width,this.height);

        //Attack Box
        if (this.isAttacking){
            c.fillStyle='green';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update(){
        this.draw();
        this.attackBox.position.x = this.position.x+this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        
        if (this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y=0;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack(){
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        },100)
    }
}

const player = new Sprite({
    position:{
        x:0,
        y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset:{
        x: 0,
        y: 0
    }
});

const enemy = new Sprite({
    position:{
        x:400,
        y:100
    },
    velocity:{
        x:0,
        y:0
    },
    color:'blue',
    offset:{
        x: -50,
        y: 0
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

function detectCollision({rectangleA,rectangleB}){
    return (rectangleA.attackBox.position.x + rectangleA.attackBox.width >= rectangleB.position.x &&
        rectangleA.attackBox.position.x <= rectangleB.position.x + rectangleB.width &&
        rectangleA.attackBox.position.y + rectangleA.attackBox.height >= rectangleB.position.y &&
        rectangleA.attackBox.position.y <= rectangleB.position.y + rectangleB.height)
}

function updateLoop(){
    window.requestAnimationFrame(updateLoop);
    c.fillStyle='black';
    c.fillRect(0,0,canvas.width,canvas.height);

    player.update();
    enemy.update();

    player.velocity.x=0;
    if(keys.a.pressed && player.lastkey=='a'){
        player.velocity.x=-5;
    } else if(keys.d.pressed && player.lastkey=='d') {
        player.velocity.x=5;
    }

    enemy.velocity.x=0;
    if(keys.ArrowLeft.pressed && enemy.lastKey=='ArrowLeft'){
        enemy.velocity.x=-5;
    } else if(keys.ArrowRight.pressed && enemy.lastKey=='ArrowRight') {
        enemy.velocity.x=5;
    }

    //Detect for Enemy Collision
    if (detectCollision({rectangleA:player,rectangleB:enemy}) && player.isAttacking){
        enemy.health-=50;
        document.querySelector('#enemyHealth').style.width=((enemy.health/enemy.healthMax)*100)+ '%';
        player.isAttacking=false;
    }

    if (detectCollision({rectangleA:enemy,rectangleB:player}) && enemy.isAttacking){
        player.health-=50;
        document.querySelector('#playerHealth').style.width=((player.health/player.healthMax)*100)+ '%';
        enemy.isAttacking=false;
    }
}

updateLoop();

window.addEventListener('keydown',(e) =>{
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
        case ' ':
             player.attack();
        break;
    }

    switch (e.key){ 
        case 'ArrowRight':
            console.log('Enemy Right')
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