function generateLoot() {
    const lootItems = [
        { name: "HP Potion", addHp: 20, addMagicalPower: 0, addFireDmg: 0, addIceDmg: 0 },
        { name: "Mana Potion", addHp: 0, addMagicalPower: 20, addFireDmg: 0, addIceDmg: 0 },
        { name: "Fire Staff", addHp: 0, addMagicalPower: 10, addFireDmg: 15, addIceDmg: 0 },
        { name: "Ice Wand", addHp: 0, addMagicalPower: 10, addFireDmg: 0, addIceDmg: 15 },
        { name: "Mystic Amulet", addHp: 10, addMagicalPower: 5, addFireDmg: 5, addIceDmg: 5 }
    ];

    const randomIndex = Math.floor(Math.random() * lootItems.length);
    return lootItems[randomIndex];
}

function updateInventory(item) {
    // Assuming inventory is an array defined in inventory.js
    inventory.push(item);
    // Update player's stats based on the item
    // This function should be defined in inventory.js
    updatePlayerStats(item);
}

function lootBoss() {
    const loot = generateLoot();
    updateInventory(loot);
    console.log(`You have looted: ${loot.name}`);
}