// This file contains the main game logic for the boss fight game. 
// It handles the game loop, player actions, and updates the description box.

import { $ } from './helpers.js';
// import { handleAction } from './test.js';
import { gameClock } from './clock.js';
import { player } from './player.js';
import { spells } from './spells.js';

console.log(player)

let boss;

function resetGame() {
    boss = {
        name: 'Boss',
        level: 1,
        totalHP: 500,
        currentHP: 500,
        damage: 10
    };

    resetStats();
}

resetGame();
$('boss-description').prepend('Boss Hp:' + boss.totalHP);
$('player-description').prepend('Player Hp:' + player.stats.total.totalHP);


function updateDescription(boxName, message) {
        const descriptionBox = $(boxName);
        const newMessage = document.createElement('p');
        newMessage.innerText = message;
        descriptionBox.prepend(newMessage);
}

function damageToBossHp(damage, resistance, source) {
    const actualDamage = Math.floor(damage * (100 - resistance) / 100);
    boss.hp -= actualDamage;
    if (boss.hp < 0) boss.hp = 0;
    $('boss-hp').textContent = boss.hp;
    updateDescription(`Boss took ${actualDamage} dmg from ${source}`);
    checkBossDefeated();
}

function damageToPlayerHp(damage, source) {
    player.hp -= damage;
    if (player.hp < 0) player.hp = 0;
    $('player-hp').textContent = player.hp;
    updateDescription(`Player took ${damage} dmg from ${source}`);
    if (player.hp === 0) {
        playerDefeated();
    }
}

function healPlayerHp(amount) {
    player.hp += amount;
    if (player.hp > 100) player.hp = player.maxHp; // Assuming 100 is the max HP
    $('player-hp').textContent = player.hp;
    updateDescription(`Player healed ${amount} HP`);
}

function playerDefeated() {
    const modal = $('modal');
    const modalMessage = $('modal-message');
    const tryAgainButton = $('try-again-button');

    modalMessage.innerText = 'You are defeated. Would you like to try again?';
    modal.style.display = 'block';

    tryAgainButton.addEventListener('click', resetGame);
}

function checkBossDefeated() {
    if (boss.hp <= 0) {
        updateDescription("You defeated the boss! Looting...");
        // Trigger loot generation here
    }
}

function restoreMana() {
    player.mana += 30;
    updateDescription("You restored 30 mana!");
    updateDisplays();
}

// Event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {

    // console.log('spells', spells);
    setTimeout(() => {
        spells.iceBolt.cast(player, boss, player.stats.total.totalIceDMG);
        console.log('player', player);
        console.log('boss', boss);

        updateDisplays();
        updateDescription('boss-description', `Boss Hp:  ${boss.currentHP}`);
    }, 2000);


    // performSpellAction(spellobject.icebolt);

    // const fireSpellButton = $('fire-spell');
    // const iceSpellButton = $('ice-spell');
    // const healButton = $('heal');
    // const restoreManaButton = $('restore-mana');

    // fireSpellButton.addEventListener('click', () => {
    //     if (player.mana >= 10) {
    //         player.mana -= 10;
    //         damageToBossHp(player.fireDamage, boss.fireResistance, 'Fire Spell');
    //         damageToPlayerHp(boss.damage, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana!");
    //     }
    // });

    // iceSpellButton.addEventListener('click', () => {
    //     if (player.mana >= 10) {
    //         player.mana -= 10;
    //         damageToBossHp(player.iceDamage, boss.iceResistance, 'Ice Spell');
    //         damageToPlayerHp(boss.damage, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana!");
    //     }
    // });

    // healButton.addEventListener('click', () => {
    //     if (player.mana >= 15) {
    //         player.mana -= 15;
    //         healPlayerHp(player.healPower);
    //         damageToPlayerHp(boss.damage, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana to heal!");
    //     }
    // });

    // restoreManaButton.addEventListener('click', () => {
    //     restoreMana();
    // });
});

function resetStats() {
    boss.currentHp = boss.maxHp;
    player.currentHp = player.maxHp;
    player.currentMana = player.maxMana;

    updateDisplays();
}


function startFight() {
    resetStats();
}

//display update
function updateDisplays() {
    $('boss-current-health').textContent = boss.currentHp;
    $('boss-max-health').textContent = boss.maxHp;
    $('player-current-hp').textContent = player.currentHp;
    $('player-max-hp').textContent = player.maxHp;
    $('player-current-mana').textContent = player.currentMana;
    $('player-max-mana').textContent = player.maxMana;
    // Update other displays if necessary
}