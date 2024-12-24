// This file contains the main game logic for the boss fight game. 
// It handles the game loop, player actions, and updates the description box.

let player, boss;

function resetGame() {
    player = {
        hp: 100,
        mana: 50,
        magicalPower: 10,
        healPower: 10,
        fireDamage: 15,
        iceDamage: 15,
        inventory: []
    };
    
    boss = {
        hp: 500,
        fireResistance: 10,
        iceResistance: 10,
        damage: 10
    };    

    updateDisplays();
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

resetGame();

function updateDescription(message) {
    const descriptionBox = document.getElementById('description-box');
    const newMessage = document.createElement('p');
    newMessage.innerText = message;
    descriptionBox.prepend(newMessage);
}

function damageToBossHp(damage, resistance, source) {
    const actualDamage = Math.floor(damage * (100 - resistance) / 100);
    boss.hp -= actualDamage;
    if (boss.hp < 0) boss.hp = 0;
    document.getElementById('boss-hp').textContent = boss.hp;
    updateDescription(`Boss took ${actualDamage} dmg from ${source}`);
    checkBossDefeated();
}

function damageToPlayerHp(damage, source) {
    player.hp -= damage;
    if (player.hp < 0) player.hp = 0;
    document.getElementById('player-hp').textContent = player.hp;
    updateDescription(`Player took ${damage} dmg from ${source}`);
    if (player.hp === 0) {
        playerDefeated();
    }
}

function healPlayerHp(amount) {
    player.hp += amount;
    if (player.hp > 100) player.hp = 100; // Assuming 100 is the max HP
    document.getElementById('player-hp').textContent = player.hp;
    updateDescription(`Player healed ${amount} HP`);
}

function playerDefeated() {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const tryAgainButton = document.getElementById('try-again-button');

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
    const fireSpellButton = document.getElementById('fire-spell');
    const iceSpellButton = document.getElementById('ice-spell');
    const healButton = document.getElementById('heal');
    const restoreManaButton = document.getElementById('restore-mana');

    fireSpellButton.addEventListener('click', () => {
        if (player.mana >= 10) {
            player.mana -= 10;
            damageToBossHp(player.fireDamage, boss.fireResistance, 'Fire Spell');
            damageToPlayerHp(boss.damage, 'Boss Attack');
            updateDisplays();
        } else {
            updateDescription("Not enough mana!");
        }
    });

    iceSpellButton.addEventListener('click', () => {
        if (player.mana >= 10) {
            player.mana -= 10;
            damageToBossHp(player.iceDamage, boss.iceResistance, 'Ice Spell');
            damageToPlayerHp(boss.damage, 'Boss Attack');
            updateDisplays();
        } else {
            updateDescription("Not enough mana!");
        }
    });

    healButton.addEventListener('click', () => {
        if (player.mana >= 15) {
            player.mana -= 15;
            healPlayerHp(player.healPower);
            damageToPlayerHp(boss.damage, 'Boss Attack');
            updateDisplays();
        } else {
            updateDescription("Not enough mana to heal!");
        }
    });

    restoreManaButton.addEventListener('click', () => {
        restoreMana();
    });
});

// Initial display update
function updateDisplays() {
    document.getElementById('boss-hp').textContent = boss.hp;
    document.getElementById('player-hp').textContent = player.hp;
    document.getElementById('player-mana').textContent = player.mana;
    // Update other displays if necessary
}

updateDisplays();