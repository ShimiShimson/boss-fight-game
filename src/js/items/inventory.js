// This file manages the inventory system. It handles item storage, equipping items on right-click, and updating the player's stats based on equipped items.

class Inventory {
    constructor() {
        this.items = [];
        this.equippedItems = {
            weapon: null,
            armor: null,
        };
    }

    addItem(item) {
        this.items.push(item);
        this.updateInventoryDisplay();
    }

    equipItem(item) {
        if (item.type === 'weapon') {
            this.equippedItems.weapon = item;
        } else if (item.type === 'armor') {
            this.equippedItems.armor = item;
        }
        this.updateStats();
        this.updateInventoryDisplay();
    }

    updateStats() {
        let totalHp = 100; // Base HP
        let totalMagicalPower = 0; // Base Magical Power
        let totalFireDmg = 0; // Base Fire DMG
        let totalIceDmg = 0; // Base Ice DMG

        if (this.equippedItems.weapon) {
            totalMagicalPower += this.equippedItems.weapon.addMagicalPower || 0;
            totalFireDmg += this.equippedItems.weapon.addFireDmg || 0;
            totalIceDmg += this.equippedItems.weapon.addIceDmg || 0;
        }

        if (this.equippedItems.armor) {
            totalHp += this.equippedItems.armor.addHp || 0;
        }

        // Update player's stats in the game (this part depends on how the game is structured)
    }

    updateInventoryDisplay() {
        // Logic to update the inventory display in the UI
        console.log('Inventory updated:', this.items);
    }

    handleRightClick(event, item) {
        event.preventDefault();
        this.equipItem(item);
    }
}

// Example usage
const inventory = new Inventory();
document.addEventListener('contextmenu', (event) => {
    const item = /* logic to get the item based on the event */
    inventory.handleRightClick(event);
});