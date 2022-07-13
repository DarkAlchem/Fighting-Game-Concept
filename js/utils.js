function determineWinner({player,enemy, timerId}){
    clearTimeout(timerId);
    document.querySelector('#roundtext').style.display = 'flex';
    if (player.health === enemy.health) {
        document.querySelector('#roundtext').innerHTML = 'tie';
    } else if (player.health <= enemy.health) {
        document.querySelector('#roundtext').innerHTML = 'Player 2 Win';
    } else if (player.health >= enemy.health) {
        document.querySelector('#roundtext').innerHTML = 'Player 1 Win';
    }
}

let timer = 60;
let timerId;
function decreaseTimer(){
    timerId = setTimeout(decreaseTimer,1000)
    if (timer>0) {
        timer--;
        document.querySelector('#timer').innerText=timer;
    }

    if (timer===0){
        determineWinner({player,enemy,timerId})
    }
}

function detectCollision({rectangleA,rectangleB}){
    return (rectangleA.attackBox.position.x + rectangleA.attackBox.width >= rectangleB.position.x &&
        rectangleA.attackBox.position.x <= rectangleB.position.x + rectangleB.width &&
        rectangleA.attackBox.position.y + rectangleA.attackBox.height >= rectangleB.position.y &&
        rectangleA.attackBox.position.y <= rectangleB.position.y + rectangleB.height)
}