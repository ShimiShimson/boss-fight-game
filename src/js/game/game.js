// @ts-nocheck
// This file contains the main game logic for the boss fight game. 
// It handles the game loop, player actions, and updates the description box.

import { boss } from '../characters/boss.js';
import { player, updatePlayerOnLevelUp } from '../characters/player.js';
import { updateSpells } from '../spells/spells.js';
import { modal } from '../ui/modal.js';
import { $, clearAllTimeouts } from '../utils/helpers.js';
import { gameClock } from './clock.js';

import * as BUTTONS from '../ui/buttons.js';
import * as GLOBALS from '../utils/globals.js';
import * as DISPLAYS from '../ui/displays.js';

// console.log(player)
export let isFightOn = false;


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

    DISPLAYS.updateDisplays();

}


export function checkandHandleBossDefeat() {
    // console.log(boss.stats.base.currentHP)
    if (boss.stats.base.currentHP <= 0) {

        console.log('//////////////BOSS DEAD!!!//////////////');
        // console.log('bossAttackInterval', bossAttackIntervalId)

        if (GLOBALS.bossAttackIntervalId) {
            clearInterval(GLOBALS.bossAttackIntervalId);
        }
        updateDescription('boss-description', "Boss is DEAD! Looting...");
        // Trigger loot generation here
        fightOver();
        return true;
    }
    return false;
}



function startFight() {
    isFightOn = true;
    console.log('fight started!');
    resetStats();

    BUTTONS.disableButtonsFrom('action-buttons', true);
    BUTTONS.disableButtonsFrom('spell-grid', false);

    DISPLAYS.updateDescription('player-description', `Fight started!`);

    gameClock.start();

    boss.startBossAttackLoop();
}

export function fightOver() {
    isFightOn = false;
    gameClock.stop();
    clearAllTimeouts(GLOBALS.nerfTimeoutIds);
    clearAllTimeouts(GLOBALS.buffTimeoutIds);
    resetStats();
    BUTTONS.disableButtonsFrom('action-buttons', false);
    BUTTONS.disableButtonsFrom('spell-grid', true);
}


function prepareButtons() {
    $('fight-boss-btn').addEventListener('click', (e) => {
        // console.log("CLICK!")
        e.target.disabled = true;
        startFight();
    });

    DISPLAYS.prepareTryAgainButton();
};


// Event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM CONTENT LOADED');

    if (player) {
        updatePlayerOnLevelUp(player);
    } else {
        throw Error("Player not found");
    }

    if (boss) {
        // console.log('BOSSSSSSSS', boss)
        boss.updateBossOnLevelUp(boss);
    } else {
        throw Error("Boss not found");
    }

    resetStats();

    BUTTONS.createSpellButtons();

    DISPLAYS.updateDisplays();

    prepareButtons();

    player.stats.base.currentMana = 1;
    $('boss-description').prepend('Boss Hp:' + boss.stats.base.totalHP);
    $('player-description').prepend('Player Hp:' + player.stats.base.totalHP);


    // DELETE LATER 
    // player.stats.base.currentHP = 900;
    // updateDisplays();


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
    //         damageToBossHp(player.fireDMG, boss.fireResistance, 'Fire Spell');
    //         damageToPlayerHp(boss.stats.base.baseDMG, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana!");
    //     }
    // });

    // iceSpellButton.addEventListener('click', () => {
    //     if (player.mana >= 10) {
    //         player.mana -= 10;
    //         damageToBossHp(player.iceDMG, boss.iceResistance, 'Ice Spell');
    //         damageToPlayerHp(boss.stats.base.baseDMG, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana!");
    //     }
    // });

    // healButton.addEventListener('click', () => {
    //     if (player.mana >= 15) {
    //         player.mana -= 15;
    //         healPlayerHp(player.healPower);
    //         damageToPlayerHp(boss.stats.base.baseDMG, 'Boss Attack');
    //         updateDisplays();
    //     } else {
    //         updateDescription("Not enough mana to heal!");
    //     }
    // });

    // restoreManaButton.addEventListener('click', () => {
    //     restoreMana();
    // });
});