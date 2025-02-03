// @ts-nocheck
import { boss } from "../characters/boss.js";
import { player } from "../characters/player.js";
import { isFightOn } from "../game/game.js";
import { updateSpells } from "../spells/spells.js";
import { $ } from "../utils/helpers.js";


function disableButtonsFrom(divId, bool) {
    const parentDiv = $(divId);

    for (let i = 0; i < parentDiv.children.length; i++) {
        parentDiv.children[i].disabled = bool;
    }
}

function createSpellButtons() {
    console.log('createSpellButtons');
    // console.log(player);
    // console.log(boss);


    const spellsData = updateSpells(player, boss);
    // spellsData.basicAttack.cast(player, boss);

    // console.log(spellsData.basicAttack);
    // console.log(Object.getPrototypeOf(spellsData.basicAttack));


    const spellGrid = $('spell-grid');

    while (spellGrid.firstChild) {
        spellGrid.removeChild(spellGrid.lastChild);
    }

    for (const spell in spellsData) {
        const spellObject = spellsData[spell];
        // console.log(spellObject);


        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "spell";
        btn.id = spellObject.nameid;
        btn.textContent = spellObject.name;
        btn.disabled = isFightOn ? false : true;

        // Assign the unique onclick function
        btn.onclick = () => (spellObject.buffName) ? spellObject.applyBuff(player, boss) : spellObject.cast(player, boss);

        spellGrid.appendChild(btn); // Append the button to the container
    };

}

export {
    disableButtonsFrom,
    createSpellButtons,
}