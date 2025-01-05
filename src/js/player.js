import { gameClock } from "./clock.js";

class Player {
    constructor(name, stats, gameClock) {
        this.name = name;
        this.stats = stats; // Example: { attack: 100, defense: 50, health: 1000, mana: 200 }
        this.gameClock = gameClock;
    }

    items = {
        head: {},
        chest: {},
        leg: {},
        boot: {},
        ring: {},
        talisman: {},
        necklace: {},
        weapon: {},
        wrist: {},
        shoulder: {},
        book: {},
        glove: {},
    };

    //   useAbility(spellName) {
    //     const spell = spellobject[spellName];
    //     if (!spell) {
    //       console.log(`Spell ${spellName} does not exist.`);
    //       return;
    //     }

    //     const currentTime = this.gameClock.getTime();

    //     // Check cooldown
    //     if (this.cooldowns[spellName] && currentTime < this.cooldowns[spellName]) {
    //       console.log(`${spellName} is on cooldown!`);
    //       return;
    //     }

    //     // Check mana and health cost
    //     if (this.stats.mana < spell.manacost) {
    //       console.log(`${this.name} does not have enough mana to cast ${spellName}!`);
    //       return;
    //     }

    //     if (this.stats.health < spell.healthcost) {
    //       console.log(`${this.name} does not have enough health to cast ${spellName}!`);
    //       return;
    //     }

    //     // Apply spell effects
    //     console.log(`${this.name} used ${spellName}: ${spell.description}`);

    //     // Reduce mana and health
    //     this.stats.mana -= spell.manacost;
    //     this.stats.health -= spell.healthcost;

    //     // Damage or Heal
    //     if (spell.actionType === "damage") {
    //       console.log(`${spellName} dealt ${spell.damage} damage!`);
    //     } else if (spell.actionType === "heal") {
    //       this.stats.health += spell.healthrestore;
    //       console.log(`${spellName} healed ${spell.healthrestore} health!`);
    //     } else if (spell.actionType === "mana") {
    //       this.stats.mana += spell.manarestore;
    //       console.log(`${spellName} restored ${spell.manarestore} mana!`);
    //     }

    //     // Apply Buff
    //     if (spell.buffname) {
    //       const buff = {
    //         name: spell.buffname,
    //         amount: spell.buffamount,
    //         expiresAt: currentTime + spell.buffduration,
    //       };
    //       this.activeBuffs.push(buff);
    //       console.log(`${this.name} gained buff ${spell.buffname} with amount ${spell.buffamount}.`);
    //     }

    //     // Set cooldown
    //     this.cooldowns[spellName] = currentTime + spell.cooldown;

    //     // Handle repeat and delay
    //     if (spell.repeat > 0) {
    //       let repeatCount = 0;
    //       const interval = setInterval(() => {
    //         repeatCount++;
    //         if (repeatCount >= spell.repeat) {
    //           clearInterval(interval);
    //         }

    //         if (spell.actionType === "damage") {
    //           console.log(`${spellName} dealt ${spell.damage} damage (repeat ${repeatCount})!`);
    //         } else if (spell.actionType === "heal") {
    //           this.stats.health += spell.healthrestore;
    //           console.log(`${spellName} healed ${spell.healthrestore} health (repeat ${repeatCount})!`);
    //         }
    //       }, spell.delay);
    //     }
    //   }


    // Display current stats and buffs
    showStats() {
        console.log(`Player Stats:`, this.stats);
        console.log(`Active Buffs:`, this.activeBuffs);
    }
}




const playerStats = {
    level: 1,
    gold: 0,
    experience: 0,



    total: {
        totalHP: 100,
        currentHP: 0,
        totalMana: 0,
        currentMana: 50,
        totalDodge: 0,
        totalMagicPow: 10,
        totalDamage: 10,
        totalIceDMG: 10,
        totalFireDMG: 0,
        totalStormDMG: 0,
        totalCritical: 0,
        totalBloodDMG: 0,
        totalShadowDMG: 0,
        totalNatureDMG: 0,
        totalHealPow: 0,
        totalLifesteal: 0,
    },

    cooldowns: {
        basicattackcooldown: false,
        iceboltcooldown: false,
        fireboltcooldown: false,
        stormboltcooldown: false,
        shadowboltcooldown: false,
        thornscooldown: false,
        bloodstrikecooldown: false,
        healcooldown: false,
        shieldcooldown: false,
        buffmagiccooldown: false,
        naturehealcooldown: false,
        manarestorecooldown: false,

        icebuffcooldown: false,
        firebuffcooldown: false,
        stormbuffcooldown: false,
        shadowbuffcooldown: false,
        bloodsapcooldown: false,
        healwingscooldown: false,
        helmetcooldown: false,
        attackbuffcooldown: false,
        magebuffcooldown: false,
        lotuscooldown: false,
        magicattackcooldown: false,
        defensehealcooldown: false,
    },


    buffs: {
        buffHealth: 0,
        buffMana: 0,
        buffDodge: 0,
        buffMagicPow: 0,
        buffDamage: 0,
        buffIceDMG: 0,
        buffFireDMG: 0,
        buffStormDMG: 0,
        buffBloodDMG: 0,
        buffCritical: 0,
        buffShadowDMG: 0,
        buffNatureDMG: 0,
        buffHealPow: 0,
        buffLifesteal: 0,
    },

    nerfs: {
        nerfHealth: 0,
        nerfMana: 0,
        nerfDodge: 0,
        nerfMagicPow: 0,
        nerfDamage: 0,
        nerfIceDMG: 0,
        nerfFireDMG: 0,
        nerfStormDMG: 0,
        nerfBloodDMG: 0,
        nerfCritical: 0,
        nerfShadowDMG: 0,
        nerfNatureDMG: 0,
        nerfHealPow: 0,
        nerfLifesteal: 0,
    }
}

export const player = new Player("Player", playerStats, gameClock);

