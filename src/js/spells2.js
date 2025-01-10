import { gameClock } from "./clock.js";

class Spell {
    constructor({
        description,
        name,
        actionType,
        baseDamage,
        manacost,
        healthcost,
        cooldown,
        effect
    }) {
        this.description = description;
        this.name = name;
        this.actionType = actionType;
        this.baseDamage = baseDamage;
        this.manacost = manacost;
        this.healthcost = healthcost;
        this.cooldown = cooldown;
        this.effect = effect;
        this.lastCastTime = null;
    }

    isOffCooldown() {
        if (this.lastCastTime === null) return true;
        const currentTime = gameClock.getTime();
        return currentTime - this.lastCastTime >= this.cooldown;
    }

    hasEnoughMana(caster) {
        return caster.stats.total.currentMana >= this.manacost;
    }

    cast(caster, target) {
        if (!this.isOffCooldown()) {
            const remainingCooldown = this.cooldown - (gameClock.getTime() - this.lastCastTime);
            console.log(`${this.description} is on cooldown. (${remainingCooldown / 1000}s remaining)`);
            return false;
        }

        if (!this.hasEnoughMana(caster)) {
            console.log(`${caster.name} does not have enough mana to cast ${this.description}.`);
            return false;
        }

        this.lastCastTime = gameClock.getTime();
        caster.stats.total.currentMana -= this.manacost;

        console.log(`${this.name} is cast!`);
        this.effect(caster, target);

        return true;
    }
}

class Buff {
    constructor({ name, statAffected, amount, duration, cooldown }) {
        this.name = name;
        this.statAffected = statAffected;
        this.amount = amount;
        this.duration = duration;
        this.cooldown = cooldown;
        this.lastAppliedTime = null;
    }

    isOffCooldown() {
        if (this.lastAppliedTime === null) return true;
        const currentTime = gameClock.getTime();
        return currentTime - this.lastAppliedTime >= this.cooldown;
    }

    apply(caster) {
        if (!this.isOffCooldown()) {
            const remainingCooldown = this.cooldown - (gameClock.getTime() - this.lastAppliedTime);
            console.log(`${this.name} is on cooldown. (${remainingCooldown / 1000}s remaining)`);
            return false;
        }

        this.lastAppliedTime = gameClock.getTime();
        caster.activeBuffs.push({
            name: this.name,
            statAffected: this.statAffected,
            amount: this.amount,
            expiryTime: gameClock.getTime() + this.duration
        });

        console.log(`${this.name} applied to ${caster.name}, increasing ${this.statAffected} by ${this.amount} for ${this.duration / 1000} seconds.`);
        return true;
    }
}

class Nerf {
    constructor({ name, statAffected, amount, duration, cooldown }) {
        this.name = name;
        this.statAffected = statAffected;
        this.amount = amount;
        this.duration = duration;
        this.cooldown = cooldown;
        this.lastAppliedTime = null;
    }

    isOffCooldown() {
        if (this.lastAppliedTime === null) return true;
        const currentTime = gameClock.getTime();
        return currentTime - this.lastAppliedTime >= this.cooldown;
    }

    apply(target) {
        if (!this.isOffCooldown()) {
            const remainingCooldown = this.cooldown - (gameClock.getTime() - this.lastAppliedTime);
            console.log(`${this.name} is on cooldown. (${remainingCooldown / 1000}s remaining)`);
            return false;
        }

        this.lastAppliedTime = gameClock.getTime();
        target.activeNerfs.push({
            name: this.name,
            statAffected: this.statAffected,
            amount: this.amount,
            expiryTime: gameClock.getTime() + this.duration
        });

        console.log(`${this.name} applied to ${target.name}, reducing ${this.statAffected} by ${this.amount} for ${this.duration / 1000} seconds.`);
        return true;
    }
}

class Player {
    constructor(name, stats) {
        this.name = name;
        this.stats = stats;
        this.activeBuffs = [];
        this.activeNerfs = [];
    }

    updateBuffsAndNerfs() {
        const currentTime = gameClock.getTime();

        // Remove expired buffs
        this.activeBuffs = this.activeBuffs.filter(buff => {
            const remainingDuration = buff.expiryTime - currentTime;
            if (remainingDuration > 0) {
                console.log(`Buff ${buff.name} has ${remainingDuration / 1000}s remaining.`);
                return true;
            }
            console.log(`Buff ${buff.name} expired.`);
            return false;
        });

        // Remove expired nerfs
        this.activeNerfs = this.activeNerfs.filter(nerf => {
            const remainingDuration = nerf.expiryTime - currentTime;
            if (remainingDuration > 0) {
                console.log(`Nerf ${nerf.name} has ${remainingDuration / 1000}s remaining.`);
                return true;
            }
            console.log(`Nerf ${nerf.name} expired.`);
            return false;
        });

        // Recalculate stats
        this.recalculateStats();
    }

    recalculateStats() {
        const baseStats = { ...this.stats.base };

        // Apply buffs
        this.activeBuffs.forEach(buff => {
            baseStats[buff.statAffected] += buff.amount;
        });

        // Apply nerfs
        this.activeNerfs.forEach(nerf => {
            baseStats[nerf.statAffected] -= nerf.amount;
        });

        this.stats.total = baseStats;
    }
}

const playerStats = {
    base: {
        totalHP: 100,
        currentHP: 100,
        totalMana: 50,
        currentMana: 50,
        totalDamage: 10,
        totalMagicPow: 10,
        totalIceDMG: 10,
        totalFireDMG: 0,
    },
    total: {}
};

const player = new Player("Player", playerStats);
player.recalculateStats();

const spells = {
    iceBolt: new Spell({
        id: "ice-spell",
        description: "Icebolt",
        name: "icebolt",
        actionType: "damage",
        baseDamage: 0,
        manacost: 50,
        healthcost: 0,
        cooldown: 5000,
        effect: (caster, target) => {
            console.log(manacost);
            
            const iceDMG = caster.stats.total.totalIceDMG;
            const magicPow = caster.stats.total.totalMagicPow;
            const finalDamage = Math.floor(iceDMG + magicPow / 2);

            target.stats.total.currentHP -= finalDamage;
            console.log(`${target.name} takes ${finalDamage} ice damage! Remaining HP: ${target.stats.total.currentHP}`);
        }
    })
};

const buffs = {
    iceBuff: new Buff({
        id: "ice-buff",
        name: "Ice Buff",
        statAffected: "totalIceDMG",
        amount: 15,
        duration: 10000,
        cooldown: 20000
    })
};

const nerfs = {
    weaken: new Nerf({
        name: "Weaken",
        statAffected: "totalDamage",
        amount: -10,
        duration: 8000,
        cooldown: 15000
    })
};

export { player, spells, buffs, nerfs };
