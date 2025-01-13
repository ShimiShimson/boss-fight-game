let player;
let dmgBuff;
let boss;
let fightOver = true;
let timeoutIds = [];
let i = 0;

function clearAllTimeouts (timeoutIds) {
    console.log('clearAllTimeouts', timeoutIds)
    while(timeoutIds.length){
      clearTimeout(timeoutIds.pop());
    }
}


function resetGame() {
    player = {
        baseDmg: 50,
        totalDmgBuff: 0,
    }
    
    dmgBuff = {
        amount: 0.5,
        duration: 5000,
    }
    
    boss = {
        hp: 100,
    }

    fightOver = false;
}

function applyDmgBuff() {
    player.totalDmgBuff = dmgBuff.amount;
    
    timeoutIds.push(setTimeout(() => {
        player.totalDmgBuff = 0;
    }, dmgBuff.duration));
}

function pressAttack () {
    const finalDmg = player.baseDmg + (player.baseDmg * player.totalDmgBuff);
    
    player.totalDmg = finalDmg;

    boss.hp = boss.hp - player.totalDmg;

    console.log('boss hp', boss.hp);


    if (boss.hp <= 0) {
        fightOver = true;
        clearAllTimeouts();

        console.log('boss defeated');
        console.log('timeoutIds', timeoutIds)

        console.log('NEWGAME')
        console.log('NEWGAME')
        startFight();

    }
};




function startFight() {
    resetGame();


    if (i % 3 === 0) {
        applyDmgBuff();
    }
    i++;
    console.log('dmgBuff: ', player.totalDmgBuff)
    setTimeout(() => {
        console.log('dmgBuff -SetTimeout: ', player.totalDmgBuff);
        pressAttack();
    }, 500);
    


    // setTimeout(() => {
    //     applyDmgBuff();
    // }, 4500);

    setTimeout(() => {
        pressAttack();
    },4500);

    // setTimeout(() => {
    //     pressAttack();
    // }, 3000);




}


startFight();



