import { $ } from "./helpers.js";

import { spells } from "./spells.js";

import { player } from "./player.js";
import { boss } from "./boss.js";

export function disableButtonsFrom(divId, bool) {
    const parentDiv = $(divId);

    for (let i = 0; i < parentDiv.children.length; i++) {
        parentDiv.children[i].disabled = bool;
    }
}

export function createSpellButtons() {

  const buttonsData = [
      { id: "spell-basic", text: "1", onClick: () =>spells.basicAttack.cast(player, boss)},
      { id: "spell-ice", text: "2", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "spell-fire", text: "3", onClick: () =>  spells.fireBolt.cast(player, boss)},
      { id: "spell-storm", text: "4", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "spell-nature", text: "5", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "spell-shadow", text: "6", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "spell-blood", text: "7", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "spell-heal", text: "8", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "spell-dodge", text: "9", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "spell-mana", text: "0", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "spell-magic", text: "-", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "spell-placeholder1", text: "=", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-basic", text: "Buff Basic", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-ice", text: "Buff Ice", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-fire", text: "Buff Fire", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-storm", text: "Buff Storm", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-nature", text: "Buff Thorns", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-shadow", text: "Buff Shadow", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-blood", text: "Buff Blood", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-heal", text: "Buff Heal", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-health", text: "Buff Health", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "spell-lotus", text: "Lotus", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-magic", text: "Buff Magic", onClick: () => spells.iceBolt.cast(player, boss)},
      { id: "buff-placeholder1", text: "Buff PH", onClick: () =>  spells.iceBolt.cast(player, boss)}
    ];
  

  const spellGrid = $('spell-grid');
  
  buttonsData.forEach(button => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "spell";
    btn.id = button.id;
    btn.textContent = button.text;
    btn.disabled = true; 
  
    // Assign the unique onclick function
    btn.onclick = button.onClick;
  
    spellGrid.appendChild(btn); // Append the button to the container
  });
  
}