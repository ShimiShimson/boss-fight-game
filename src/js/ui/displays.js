// @ts-nocheck
import { player } from '../characters/player.js';
import { boss } from '../characters/boss.js';

import { $ } from '../utils/helpers.js';

import { modal } from '../ui/modal.js';

function updateResourceBars(boss) {
    const bossHPPercent = boss.stats.base.currentHP / boss.stats.base.totalHP * 100;
    $('boss-hp-bar').style.width = bossHPPercent + '%';

    const playerHPPercent = player.stats.base.currentHP / player.stats.base.totalHP * 100;
    $('player-hp-bar').style.width = playerHPPercent + '%';

    const playerManaPercent = player.stats.base.currentMana / player.stats.base.totalMana * 100;
    $('player-mana-bar').style.width = playerManaPercent + '%';
}


// EXPORTS
function updateDescription(boxName, message) {
    const descriptionBox = $(boxName);
    const newParagraph = document.createElement('p');
    newParagraph.innerText = message;
    descriptionBox.prepend(newParagraph);
}



function updateDisplays() {
    // console.log($('player-total-hp'))
    // console.log($('player-current-hp'))

    // console.log('mana UpdateDisplays', player.stats.base.currentMana, player.stats.base.totalMana);
    $('boss-current-HP').textContent = boss.stats.base.currentHP;
    $('boss-total-HP').textContent = boss.stats.base.totalHP;
    $('player-current-hp').textContent = player.stats.base.currentHP;
    $('player-total-hp').textContent = player.stats.base.totalHP;
    $('player-current-mana').textContent = player.stats.base.currentMana;
    $('player-total-mana').textContent = player.stats.base.totalMana;

    $('player-base-pow').textContent = player.stats.base.baseDMG * player.stats.buffs.buffDMG * player.stats.nerfs.nerfDMG;
    $('player-magic-pow').textContent = player.stats.base.baseMagicPow * player.stats.buffs.buffMagicPow * player.stats.nerfs.nerfMagicPow;
    $('player-ice-pow').textContent = player.stats.base.baseIceDMG * player.stats.buffs.buffIce * player.stats.nerfs.nerfIce;
    $('player-fire-pow').textContent = player.stats.base.baseFireDMG * player.stats.buffs.buffFire * player.stats.nerfs.nerfFire;
    $('player-storm-pow').textContent = player.stats.base.baseStormDMG * player.stats.buffs.buffStorm * player.stats.nerfs.nerfStorm;
    $('player-nature-pow').textContent = player.stats.base.baseNatureDMG * player.stats.buffs.buffNature * player.stats.nerfs.nerfNature;
    $('player-shadow-pow').textContent = player.stats.base.baseShadowDMG * player.stats.buffs.buffShadow * player.stats.nerfs.nerfShadow;
    $('player-blood-pow').textContent = player.stats.base.baseBloodDMG * player.stats.buffs.buffBlood * player.stats.nerfs.nerfBlood;
    $('player-heal-pow').textContent = player.stats.base.baseHealPow * player.stats.buffs.buffHealPow * player.stats.nerfs.nerfHealPow;
    $('player-dodge-pow').textContent = player.stats.base.baseDodge * player.stats.buffs.buffDodge * player.stats.nerfs.nerfDodge;

    // console.log('player.stats', player.stats)

    // Update other displays if necessary
    updateResourceBars(boss);
}

function prepareTryAgainButton() {
    const tryAgainButton = $('try-again-button');

    tryAgainButton.addEventListener('click', function () {
        modal.hideModal();
    });
}


export {
    updateDisplays,
    updateDescription,
    prepareTryAgainButton,
}