// This file contains the main game logic for the boss fight game. 
// It handles the game loop, player actions, and updates the description box.

import { $ } from './helpers.js';
// import { handleAction } from './test.js';
import { gameClock } from './clock.js';
import { player } from './player.js';
import { spells } from './spells.js';
import Modal from './modal.js';

// console.log(player)

const boss = {
    name: 'Boss',
    stats: {
        level: 1,

        total: {
            totalHP: 100,
            currentHP: 100,
            totalDamage: 20,
        }
    }
};

const modal = new Modal();

function resetGame() {
    resetStats();
}

function prepareTryAgainButton() {
    const tryAgainButton = $('try-again-button');

    tryAgainButton.addEventListener('click', function () {
        modal.hideModal();
        resetGame();
    });
}


function updateDescription(boxName, message) {
    const descriptionBox = $(boxName);
    const newMessage = document.createElement('p');
    newMessage.innerText = message;
    descriptionBox.prepend(newMessage);
}


function playerDefeated() {
    gameClock.stop();
    modal.showModal('You are defeated. Would you like to try again?');


}

function checkBossDefeated() {
    if (boss.stats.total.currentHP <= 0) {
        updateDescription('boss-description', "Boss is defeated! Looting...");
        // Trigger loot generation here
        return true;
    }
    return false;
}

function resetStats() {
    boss.stats.total.currentHP = boss.stats.total.totalHP;
    player.stats.total.currentHP = player.stats.total.totalHP;
    player.stats.total.currentMana = player.stats.total.totalMana;

    updateDisplays();
}


function startBossAttackLoop() {
    const bossAttackInterval = setInterval(() => {
        if (checkBossDefeated()) {
            clearInterval(bossAttackInterval);
            return;
        }

        player.stats.total.currentHP -= boss.stats.total.totalDamage;
        updateDisplays();
        updateDescription('boss-description', `Boss attacks for ${boss.stats.total.totalDamage} DMG!`);
        if (player.stats.total.currentHP <= 0) {
            clearInterval(bossAttackInterval);
            playerDefeated();
            return;
        }
    }, 2000);
}


function startFight() {
    resetStats();

    updateDisplays();

    updateDescription('player-description', `Fight started!`);

    gameClock.start();

    startBossAttackLoop();
}

function updateHPBars() {
    const bossHPPercent = boss.stats.total.currentHP / boss.stats.total.totalHP * 100;
    $('boss-hp-bar').style.width = bossHPPercent + '%';

    const playerHPPercent = player.stats.total.currentHP / player.stats.total.totalHP * 100;
    $('player-hp-bar').style.width = playerHPPercent + '%';


}

//display update
function updateDisplays() {
    // console.log($('player-total-hp'))
    // console.log($('player-current-hp'))


    $('boss-current-health').textContent = boss.stats.total.currentHP;
    $('boss-total-health').textContent = boss.stats.total.totalHP;
    $('player-current-hp').textContent = player.stats.total.currentHP;
    $('player-total-hp').textContent = player.stats.total.totalHP;
    $('player-current-mana').textContent = player.stats.total.currentMana;
    $('player-total-mana').textContent = player.stats.total.totalMana;
    
    // Update other displays if necessary
    updateHPBars();

    // setTimeout(() => {
    //     updateProgress(75);
    // }, 1000);

    // setTimeout(() => {
    //     updateProgress(25);
    // }, 3000);



}

function prepareButtons() {
    $('fight-boss-btn').addEventListener('click', (e) => {
        e.target.disabled = true;
        startFight();
    });

    $('spell-basic').addEventListener('click', () => {
        spells.basicAttack.cast(player, boss);
        updateDisplays();
        updateDescription('boss-description', `Boss Hp:  ${boss.stats.total.currentHP}`);
    });

    $('spell-ice').addEventListener('click', () => {
        spells.iceBolt.cast(player, boss);
        updateDisplays();
        updateDescription('boss-description', `Boss Hp:  ${boss.stats.total.currentHP}`);
    })

    prepareTryAgainButton();
};


// Event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM CONTENT LOADED')

    resetGame();
    updateDisplays();
    prepareButtons();

    $('boss-description').prepend('Boss Hp:' + boss.stats.total.totalHP);
    $('player-description').prepend('Player Hp:' + player.stats.total.totalHP);


    // console.log('spells', spells);
    // setTimeout(() => {
    //     spells.iceBolt.cast(player, boss, player.stats.total.totalIceDMG);
    //     console.log('player', player);
    //     console.log('boss', boss);

    //     updateDisplays();
    //     updateDescription('boss-description', `Boss Hp:  ${boss.stats.total.currentHP}`);
    // }, 2000);





    // performSpellAction(spellobject.icebolt);

    // const fireSpellButton = $('fire-spell');
    // const iceSpellButton = $('ice-spell');
    // const healButton = $('heal');
    // const restoreManaButton = $('restore-mana');

    // fireSpellButton.addEventListener('click', () => {
    //     if (player.mana >= 10) {
    //         player.mana -= 10;
    //         damageToBossHp(player.fireDamage, boss.fireResistance, 'Fire Spell');
    //         damageToPlayerHp(boss.stats.total.totalDamage, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana!");
    //     }
    // });

    // iceSpellButton.addEventListener('click', () => {
    //     if (player.mana >= 10) {
    //         player.mana -= 10;
    //         damageToBossHp(player.iceDamage, boss.iceResistance, 'Ice Spell');
    //         damageToPlayerHp(boss.stats.total.totalDamage, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana!");
    //     }
    // });

    // healButton.addEventListener('click', () => {
    //     if (player.mana >= 15) {
    //         player.mana -= 15;
    //         healPlayerHp(player.healPower);
    //         damageToPlayerHp(boss.stats.total.totalDamage, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana to heal!");
    //     }
    // });

    // restoreManaButton.addEventListener('click', () => {
    //     restoreMana();
    // });
});