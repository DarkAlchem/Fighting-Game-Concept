class Sprite{
    constructor({position, imageSrc, scale=1,framesMax=1,offset={x:0,y:0}}){
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent=0
        this.framesElapsed=0
        this.framesHold=5
        this.offset=offset
    }

    draw(){
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width/ this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x-this.offset.x,
            this.position.y-this.offset.y,
            (this.image.width / this.framesMax)* this.scale,
            this.image.height * this.scale,
        );
    }

    animateFrames(){
        this.framesElapsed++
        if (this.framesElapsed%this.framesHold===0){
            this.framesCurrent++
            if (this.framesCurrent >= this.framesMax) this.framesCurrent=0
        }
    }

    update(){
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite{
    constructor({
        position,
        velocity,
        color='red',
        imageSrc,
        scale=1,
        framesMax=1,
        offset={x:0,y:0},
        sprites,
        attackBox = {offset:{},width:undefined,height:undefined}
    }){
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.health=500;
        this.healthMax=500;
        this.color = color;
        this.isAttacking=false;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites=sprites;
        this.feint=false;
        this.iframes=0;
        this.attackBox = {
            position:{
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height 
        }

        for (const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    switchSprite(sprite){
        if (this.image === this.sprites.feint.image){
            if (this.framesCurrent === this.sprites.feint.framesMax-1) this.feint=true;
            return;
        }
        
        if (
            this.image === this.sprites.damaged.image &&
            this.framesCurrent < this.sprites.damaged.framesMax - 1
        ) return;
        
        if (
            this.image === this.sprites.attacka.image &&
            this.framesCurrent < this.sprites.attacka.framesMax - 1
        ) return;

        switch (sprite){
            case 'idle':
                if (this.image !== this.sprites.idle.image){ 
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent=0
                }
            break;
            case 'run':
                if (this.image !== this.sprites.run.image){ 
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent=0
                }
            break;
            case 'jump':
                if (this.image !== this.sprites.jump.image){ 
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent=0
                }
            break;
            case 'fall':
                if (this.image !== this.sprites.fall.image){ 
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent=0
                }
            break;
            case 'attack':
                if (this.image !== this.sprites.attacka.image){ 
                    this.image = this.sprites.attacka.image
                    this.framesMax = this.sprites.attacka.framesMax
                    this.framesCurrent=0
                }
            break;
            case 'damaged':
                if (this.image !== this.sprites.damaged.image){ 
                    this.image = this.sprites.damaged.image
                    this.framesMax = this.sprites.damaged.framesMax
                    this.framesCurrent=0
                }
            break;
            case 'feint':
                if (this.image !== this.sprites.feint.image){ 
                    this.image = this.sprites.feint.image
                    this.framesMax = this.sprites.feint.framesMax
                    this.framesCurrent=0
                }
            break;
        }
    }

    /*draw(){
        c.fillStyle=this.color;
        c.fillRect(this.position.x,this.position.y,this.width,this.height);

        //Attack Box
        
    }*/

    update(hitstop){
        this.draw();
        if(hitstop==0){
            if (!this.feint) this.animateFrames();
            this.attackBox.position.x = this.position.x+this.attackBox.offset.x;
            this.attackBox.position.y = this.position.y+this.attackBox.offset.y;
            
            this.position.y += this.velocity.y;
            if(!this.isAttacking)this.position.x += this.velocity.x;
            
            if (this.position.y + this.height + this.velocity.y >= canvas.height-85){
                this.velocity.y=0;
                this.position.y=342;
            } else this.velocity.y += gravity;
        }
        if(this.iframes>0) this.iframes--;
    }

    takeHit(){
        if (this.iframes==0){
            this.iframes=10;
            this.health-=50;
        }
        if (this.health > 0){
            this.switchSprite('damaged');
        } else {
            this.switchSprite('feint');
        }
    }

    attack(){
        this.switchSprite('attack')
        this.velocity.x=0;
        this.isAttacking = true;
    }
}