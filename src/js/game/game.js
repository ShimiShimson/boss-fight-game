// @ts-nocheck
// This file contains the main game logic for the boss fight game. 
// It handles the game loop, player actions, and updates the description box.

import { $, clearAllTimeouts } from '../utils/helpers.js';
import { gameClock } from './clock.js';
import { player } from '../characters/player.js';
import { boss, nerfTimeoutIds } from '../characters/boss.js';
import { updateSpells } from '../spells/spells.js';
import Modal from '../ui/modal.js';

// import { disableButtonsFrom, createSpellButtons } from '../ui/buttons.js';

// console.log(player)

let spells = {};

const modal = new Modal();

function prepareTryAgainButton() {
    const tryAgainButton = $('try-again-button');

    tryAgainButton.addEventListener('click', function () {
        modal.hideModal();
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
    if (boss.stats.base.currentHP <= 0) {
        updateDescription('boss-description', "Boss is defeated! Looting...");
        // Trigger loot generation here
        return true;
    }
    return false;
}

function resetStats() {
    // console.log(player.stats.buffs);
    // console.log(player.stats.nerfs);

    boss.stats.base.currentHP = boss.stats.base.totalHP;
    player.stats.base.currentHP = player.stats.base.totalHP;
    player.stats.base.currentMana = player.stats.base.totalMana;

    Object.keys(player.stats.buffs).forEach(key => player.stats.buffs[key] = 1);
    Object.keys(player.stats.nerfs).forEach(key => player.stats.nerfs[key] = 1);
    // console.log(player.stats)

    updateDisplays();

}

let bossAttackIntervalId = null;

export function checkandHandleBossDefeat() {
    console.log(boss.stats.base.currentHP)
    if (boss.stats.base.currentHP <= 0) {

        console.log('//////////////BOSS DEAD!!!//////////////');
        console.log('bossAttackInterval', bossAttackIntervalId)

        if (bossAttackIntervalId) {
            clearInterval(bossAttackIntervalId);
        }
        updateDescription('boss-description', "Boss is DEAD! Looting...");
        // Trigger loot generation here
        fightOver();
        return true;
    }
    return false;
}


function startBossAttackLoop() {
    bossAttackIntervalId = setInterval(() => {
        boss.checkAndCastRandomNerf(player);

        player.stats.base.currentHP -= boss.stats.base.totalDamage;
        updateDisplays();
        updateDescription('boss-description', `Boss attacks for ${boss.stats.base.totalDamage} DMG!`);
        if (player.stats.base.currentHP <= 0) {
            clearInterval(bossAttackIntervalId);
            fightOver();
            playerDefeated();
            return;
        }
    }, 2000);
}


function startFight() {
    resetStats();
    
    disableButtonsFrom('action-buttons', true);
    disableButtonsFrom('spell-grid', false);

    updateDescription('player-description', `Fight started!`);

    gameClock.start();

    startBossAttackLoop();
}

function fightOver() {
    gameClock.stop();
    clearAllTimeouts(nerfTimeoutIds);
    resetStats();
    disableButtonsFrom('action-buttons', false);
    disableButtonsFrom('spell-grid', true);
}

function updateHPBars() {
    const bossHPPercent = boss.stats.base.currentHP / boss.stats.base.totalHP * 100;
    $('boss-hp-bar').style.width = bossHPPercent + '%';

    const playerHPPercent = player.stats.base.currentHP / player.stats.base.totalHP * 100;
    $('player-hp-bar').style.width = playerHPPercent + '%';


}

//display update
function updateDisplays() {
    // console.log($('player-total-hp'))
    // console.log($('player-current-hp'))


    $('boss-current-health').textContent = boss.stats.base.currentHP;
    $('boss-total-health').textContent = boss.stats.base.totalHP;
    $('player-current-hp').textContent = player.stats.base.currentHP;
    $('player-total-hp').textContent = player.stats.base.totalHP;
    $('player-current-mana').textContent = player.stats.base.currentMana;
    $('player-total-mana').textContent = player.stats.base.totalMana;

    // Update other displays if necessary
    updateHPBars();

    // setTimeout(() => {
    //     updateProgress(75);
    // }, 1000);

    // setTimeout(() => {
    //     updateProgress(25);
    // }, 3000);



}

// function prepareButtons() {
//     $('fight-boss-btn').addEventListener('click', (e) => {
//         e.target.disabled = true;
//         startFight();
//     });

//     $('spell-basic').addEventListener('click', () => {
//         spells.basicAttack.cast(player, boss);
//         updateDisplays();
//         updateDescription('boss-description', `Boss Hp:  ${boss.stats.base.currentHP}`);
//     });

//     $('spell-ice').addEventListener('click', () => {
//         spells.iceBolt.cast(player, boss);
//         updateDisplays();
//         updateDescription('boss-description', `Boss Hp:  ${boss.stats.base.currentHP}`);
//     })

//     prepareTryAgainButton();
// };


// Event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM CONTENT LOADED');

    // createSpellButtons();

    resetStats();
    updateDisplays();
    // prepareButtons();

    spells = updateSpells(player, boss);
    console.log('SPELLS', spells);

    $('boss-description').prepend('Boss Hp:' + boss.stats.base.totalHP);
    $('player-description').prepend('Player Hp:' + player.stats.base.totalHP);

    // DELETE LATER 
    player.stats.base.currentHP = 900;
    updateDisplays();


    // console.log('spells', spells);
    // setTimeout(() => {
    //     spells.iceBolt.cast(player, boss, player.stats.base.totalIceDMG);
    //     console.log('player', player);
    //     console.log('boss', boss);

    //     updateDisplays();
    //     updateDescription('boss-description', `Boss Hp:  ${boss.stats.base.currentHP}`);
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
    //         damageToPlayerHp(boss.stats.base.totalDamage, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana!");
    //     }
    // });

    // iceSpellButton.addEventListener('click', () => {
    //     if (player.mana >= 10) {
    //         player.mana -= 10;
    //         damageToBossHp(player.iceDamage, boss.iceResistance, 'Ice Spell');
    //         damageToPlayerHp(boss.stats.base.totalDamage, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana!");
    //     }
    // });

    // healButton.addEventListener('click', () => {
    //     if (player.mana >= 15) {
    //         player.mana -= 15;
    //         healPlayerHp(player.healPower);
    //         damageToPlayerHp(boss.stats.base.totalDamage, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana to heal!");
    //     }
    // });

    // restoreManaButton.addEventListener('click', () => {
    //     restoreMana();
    // });
});