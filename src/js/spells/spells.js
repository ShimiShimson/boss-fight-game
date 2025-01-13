// @ts-nocheck
import { gameClock } from "../game/clock.js";
import { checkandHandleBossDefeat } from "../game/game.js";

export const buffTimeoutIds = [];


export class Spell {
    constructor({        
        description,
        name,
        nameid,
        actionType,
        manacost,
        healthcost,
        manarestore,
        healthrestore,
        repeat,
        delay,
        cooldown,
        effect
    }) {
        this.description = description;
        this.name = name;
        this.nameid = nameid;
        this.actionType = actionType;
        this.manacost = manacost;
        this.healthcost = healthcost;
        this.manarestore = manarestore;
        this.healthrestore = healthrestore;
        this.repeat = repeat;
        this.delay = delay;
        this.cooldown = cooldown;
        this.effect = effect;
        this.lastCastTime = null;
    }

    isOffCooldown() {
        console.log(this.lastCastTime)
        if (this.lastCastTime === null) return true;

        const currentTime = gameClock.getTime();
        // console.log('currentTime', currentTime)
        // console.log('this.lastCastTime', this.lastCastTime)
        // console.log('currentTime - this.lastCastTime', currentTime - this.lastCastTime)

        console.log(this.cooldown)
        const isOnCooldown = currentTime - this.lastCastTime < this.cooldown;
        if (isOnCooldown) {
            const remainingCooldown = this.cooldown - (gameClock.getTime() - this.lastCastTime);
            console.log(`${this.description} is on cooldown! (${remainingCooldown / 1000}s remaining)`);
            return false;
        }
        return true;
    }

    applyManacost(target) {
        if (this.manacost) {
            console.log('MANACOST!');
            target.stats.base.currentMana -= this.manacost * target.stats.level;
        }
    }

    applyHealthcost(caster) {
        if (this.healthcost) {
            console.log('HEALTHCOST!');
            caster.stats.base.currentHP -= this.healthcost * caster.stats.level;
        }
    }

    hasEnoughMana (caster, target) {
        if (this.manacost) {
            const manacost = this.manacost * target.stats.level;
            if (caster.stats.base.currentMana < manacost) {
                console.log(`${caster.name} doesn't have enough mana to cast ${this.description}!`);
                return false;
            }
        }
        return true;
    }

    hasEnoughHealth(caster) {
        if (this.healthcost) {
            const healthcost = caster.stats.base.baseHP / this.healthcost; 
            if (caster.stats.base.currentHP < healthcost) {
                console.log(`If you cast ${this.description}, it will kill you!`);
                return false;
            }
        }
        return true;
    }



    cast(caster, target) {
        // console.log('this.manacost', this.manacost);
        // console.log(caster.stats.base.currentMana)
        if (!this.isOffCooldown() || !this.hasEnoughMana(caster, target) || !this.hasEnoughHealth(caster)) return false;

        console.log('casting...')
        this.lastCastTime = gameClock.getTime();
        this.applyHealthcost(caster);
        this.applyManacost(target);
        // console.log('currentMana', caster.stats.base.currentMana)




        if (typeof this.manarestore === 'function') {
            caster.stats.base.currentMana += this.manarestore(caster);
        }

        if (typeof this.healthrestore === 'function') {
            caster.stats.base.currentHP += this.healthrestore(caster);
        }


        console.log(`${this.name} is cast!`);
        this.effect(caster, target);

        console.log('target stats base currentHP', target.stats.base.currentHP);
        if (target.stats.base.currentHP <= 0) {
            target.stats.base.currentHP = 0;
            checkandHandleBossDefeat();
        }
        if (caster.stats.base.currentHP <= 0) {
            caster.stats.base.currentHP = 0;
        }
    }
}

export class Buff extends Spell {
    constructor({ 
        description,
        name,
        nameid,
        actionType,
        manacost,
        healthcost,
        manarestore,
        healthrestore,
        cooldown,
        duration,
        buffName,
        buffDuration,
    }) {
        super({
            description,
            name,
            nameid,
            actionType,
            manacost,
            healthcost,
            manarestore,
            healthrestore,
            repeat: 0, // Default value for Buff
            delay: 0,  // Default value for Buff
            cooldown,
        });
        this.duration = duration;
        this.buffName = buffName;
        this.buffDuration = buffDuration;
        this.lastCastTime = null;

    }

    apply(caster) {
        if (!this.isOffCooldown()) {
            const remainingCooldown = this.cooldown - (gameClock.getTime() - this.lastAppliedTime);
            console.log(`${this.name} is on cooldown. (${remainingCooldown / 1000}s remaining)`);
            return false;
        }

        if(!this.hasEnoughMana(caster) || !this.hasEnoughHealth(caster)) {
            console.log(`${caster.name} doesn't have enough mana or health to cast ${this.name}!`);
        }

        console.log('applying buff...');
        this.lastAppliedTime = gameClock.getTime();

        this.applyHealthcost(caster);
        this.applyManacost(target);

        if (typeof this.manarestore === 'function') {
            this.manarestore();
        }

        if (typeof this.healthrestore === 'function') {
            this.healthrestore();
        }


        if (this.buffName) {
            caster.stats.buffs[this.buffName] = 1.5;
        }

        buffTimeoutIds.push(setTimeout(() => {
            caster.stats.buffs[this.buffName] = 1;
        }, this.buffDuration));



        caster.activeBuffs.push({
            name: this.name,
            statAffected: this.statAffected,
            amount: this.amount,
            expiryTime: gameClock.getTime() + this.duration
        });

        console.log(`${this.name} applied to ${caster.name}, increasing ${this.buffName.replace('buff', '')} by 50% for ${this.duration / 1000} seconds.`);
        return true;
    }
}





export const updateSpells = (caster, target) => {

    const casterTotalHP = caster.stats.base.totalHP;
    const casterCurrentHP = caster.stats.base.currentHP;
    const casterTotalMana = caster.stats.base.totalMana;
    const casterCurrentMana = caster.stats.base.currentMana;

    const casterBaseDamage = caster.stats.base.baseDamage;
    const casterBuffDamage = caster.stats.buffs.buffDamage;
    const casterNerfDamage = caster.stats.nerfs.nerfDamage;

    const casterBaseMagicPow = caster.stats.base.baseMagicPow;
    const casterBuffMagicPow = caster.stats.buffs.buffMagicPow;
    const casterNerfMagicPow = caster.stats.nerfs.nerfMagicPow;

    const casterBaseIceDamage = caster.stats.base.baseIceDamage;
    const casterBuffIceDamage = caster.stats.buffs.buffIceDamage;
    const casterNerfIceDamage = caster.stats.nerfs.nerfIceDamage;

    const casterBaseFireDamage = caster.stats.base.baseFireDamage;
    const casterBuffFireDamage = caster.stats.buffs.buffFireDamage;
    const casterNerfFireDamage = caster.stats.nerfs.nerfFireDamage;

    const casterBaseStormDamage = caster.stats.base.baseStormDamage;
    const casterBuffStormDamage = caster.stats.buffs.buffStormDamage;
    const casterNerfStormDamage = caster.stats.nerfs.nerfStormDamage;

    const casterBaseNatureDamage = caster.stats.base.baseNatureDamage;
    const casterBuffNatureDamage = caster.stats.buffs.buffNatureDamage;
    const casterNerfNatureDamage = caster.stats.nerfs.nerfNatureDamage;

    const casterBaseShadowDamage = caster.stats.base.baseShadowDamage;
    const casterBuffShadowDamage = caster.stats.buffs.buffShadowDamage;
    const casterNerfShadowDamage = caster.stats.nerfs.nerfShadowDamage;

    const casterBaseBloodDamage = caster.stats.base.baseBloodDamage;
    const casterBuffBloodDamage = caster.stats.buffs.buffBloodDamage;
    const casterNerfBloodDamage = caster.stats.nerfs.nerfBloodDamage;

    const casterBaseHealPow = caster.stats.base.baseHealPow;
    const casterBuffHealPow = caster.stats.buffs.buffHealPow;
    const casterNerfHealPow = caster.stats.nerfs.nerfHealPow;

    const casterBaseDodge = caster.stats.base.baseDodge;
    const casterBuffDodge = caster.stats.buffs.buffDodge;
    const casterNerfDodge = caster.stats.nerfs.nerfDodgeChance;

    const casterBaseLifesteal = caster.stats.base.baseLifesteal;
    const casterBuffLifesteal = caster.stats.buffs.buffLifesteal;
    const casterNerfLifesteal = caster.stats.nerfs.nerfLifesteal;

    const casterBaseHealth = caster.stats.base.totalHealth;
    const casterBuffHealth = caster.stats.buffs.buffHealth;
    const casterNerfHealth = caster.stats.nerfs.nerfHealth;

    const casterBaseMana = caster.stats.base.totalMana;
    const casterBuffMana = caster.stats.buffs.buffMana;
    const casterNerfMana = caster.stats.nerfs.nerfMana;

    return {
        restoreHealth: function(caster) {
            const lifesteal = Math.floor(casterBaseLifesteal * casterBuffLifesteal * casterNerfLifesteal / 4);


            // console.log('lifesteal', lifesteal)
            let currentHP = caster.stats.base.currentHP;
            const totalHP = caster.stats.base.totalHP;
            console.log('------------------------------');

            console.log('HEALTH RESTORED', lifesteal);
            currentHP += lifesteal;

            caster.stats.base.currentHP = currentHP;
            if (currentHP > totalHP) {
                caster.stats.base.currentHP = totalHP;
            }
        },

        restoreMana: function(caster) {
            let currentMana = caster.stats.base.currentMana;
            const totalMana = caster.stats.base.totalMana;


            currentMana += Math.floor(totalMana/10);

            caster.stats.base.currentMana = currentMana;
            if (currentMana > totalMana) {
                caster.stats.base.currentMana = totalMana;
            }
            console.log(`${caster.name} restores ${Math.floor(totalMana/10)} mana! Current mana: ${caster.stats.base.currentMana}`);

            // console.log('currentMana', currentMana);
        },

        // SPELLS
        basicAttack: new Spell({
            description: "Attack",
            name: "basicAttack",
            nameid: "spell-basic",
            manacost: 0,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            actionType: "damage",
            repeat: 0,
            delay: 0,
            cooldown: 2000,
            effect: (caster, target) => {
            console.log(this)
                spells.restoreHealth(caster);
                spells.restoreMana(caster);
                    
                const finalDamage = Math.floor(casterBaseDamage * casterBuffDamage * casterNerfDamage);
                console.log('final BASIC Damage', finalDamage)

                target.stats.base.currentHP -= finalDamage;
            }
        }),



        iceBolt: new Spell({
            description: "Icebolt",
            name: "iceBolt",
            nameid: "spell-ice",
            actionType: "damage",
            manacost: 10,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            cooldown: 5000,
            effect: (caster, target) => {
                
                const baseDamage = casterBaseDamage * casterBuffDamage * casterNerfDamage / 2;
                const iceDMG = caster.stats.base.baseIceDMG * caster.stats.buffs.buffIce;
                const magicPow = casterMagicPow * casterBuffMagicPow * casterNerfMagicPow / 2;

                console.log('baseDamage', baseDamage, 'iceDMG', iceDMG, 'magicPow', magicPow)

                const finalDamage = Math.floor((baseDamage + iceDMG + magicPow) * caster.stats.nerfs.nerfIce);

                console.log('final ICE Damage', finalDamage)

                target.stats.base.currentHP -= finalDamage;
                console.log(`${target.name} takes ${finalDamage} ice damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),

        fireBlast: new Spell({
            description: "Fireblast",
            name: "fireBlast",
            nameid: "spell-fire",
            actionType: "damage",
            manacost: 10,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            cooldown: 5000,
            effect: (caster, target) => {
                const baseDamage = casterBaseDamage * casterBuffDamage * casterNerfDamage / 2;
                const fireDMG = caster.stats.base.baseFireDMG * caster.stats.buffs.buffFire;
                const magicPow = casterMagicPow * casterBuffMagicPow * casterNerfMagicPow / 2;

                console.log('baseDamage', baseDamage, 'fireDMG', fireDMG, 'magicPow', magicPow)

                const finalDamage = Math.floor((baseDamage + fireDMG + magicPow) * caster.stats.nerfs.nerfFire);

                console.log('final ICE Damage', finalDamage)

                target.stats.base.currentHP -= finalDamage;
                console.log(`${target.name} takes ${finalDamage} fire damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),

        fireBlast: new Spell({
            description: "Fireblast",
            name: "fireBlast",
            nameid: "spell-fire",
            actionType: "damage",
            manacost: 10,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            cooldown: 5000,
            effect: (caster, target) => {
                const baseDamage = casterBaseDamage * casterBuffDamage * casterNerfDamage / 2;
                const fireDMG = caster.stats.base.baseFireDMG * caster.stats.buffs.buffFire;
                const magicPow = casterMagicPow * casterBuffMagicPow * casterNerfMagicPow / 2;

                console.log('baseDamage', baseDamage, 'fireDMG', fireDMG, 'magicPow', magicPow)

                const finalDamage = Math.floor((baseDamage + fireDMG + magicPow) * caster.stats.nerfs.nerfFire);

                console.log('final ICE Damage', finalDamage)

                target.stats.base.currentHP -= finalDamage;
                console.log(`${target.name} takes ${finalDamage} fire damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),



        // BUFFS
        buffDamage: new Buff({
            description: "Buff  Damage",
            name: "buffDamage",
            nameid: "buff-basic",
            actionType: "buff",
            manacost: 10,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffDamage",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        buffIce: new Buff({
            description: "Buff Ice Damage",
            name: "buffIce",
            nameid: "buff-basic",
            actionType: "buff",
            manacost: 10,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffIce",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        buffFire: new Buff({
            description: "Buff Fire Damage",
            name: "buffFire",
            nameid: "buff-basic",
            actionType: "buff",
            manacost: 10,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffFire",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        buffStorm: new Buff({
            description: "Buff Storm Damage",
            name: "buffStorm",
            nameid: "buff-basic",
            actionType: "buff",
            manacost: 10,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffStorm",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        buffNature: new Buff({
            description: "Buff Nature Damage",
            name: "buffNature",
            nameid: "buff-basic",
            actionType: "buff",
            manacost: 10,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffNature",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        buffShadow: new Buff({
            description: "Buff Shadow Damage",
            name: "buffShadow",
            nameid: "buff-basic",
            actionType: "buff",
            manacost: 10,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffShadow",
            buffDuration: 8000,
            cooldown: 15000,
        }),


        bloodSap: new Buff({
            description: "Caster sacrifices 25% of their health to deal BloodDMG 3 times, and heal caster for BloodDMG/3. Also gets buff for BloodDMG",
            name: "bloodSap",
            nameid: "spell-blood",
            manacost: 0,
            manarestore: 0,
            // healthrestore: Math.floor(BloodDMG/3),
            repeat: 3,
            delay: 1000,
            buffname: "buffBlood",
            // buffamount: Math.floor(BloodDMG ),
            buffduration: 5000,
            cooldown: 10000,
            effect: (caster, target) => {
                
            }
        }),

        healWings: new Spell({
            description: "Heals caster for his Heal Power 5 times at cost of 10% of his base mana",
            name: "healWings",
            namefunction: "healwings",
            nameid: "#healwings",
            damage: 0,
            manacost: casterTotalMana / 10,
            healthcost: 0,
            manarestore: 0,
            healthrestore: casterBaseHealPow * casterBuffHealPow * casterNerfHealPow / 5,
            repeat: 5,
            delay: 800,
            buffname: 0,
            buffamount: 0,
            cooldown: 10000,
        }),

        helmet: new Buff({
            description: "Vigor Of Vikings",
            name: "helmet",
            id: "buff-helmet",
            damage: 0,
            manacost: target.level * 15,
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            buffname: "buffHealth",
            buffamount: Math.floor(casterTotalMana / 2),
            cooldown: 10000,
            buffduration: 15000,
        }),


        lotus: new Spell({
            description: "Lotus",
            name: "lotus",
            id: "spell-lotus",
            damage: 0,
            manacost: 0,
            healthcost: 0,
            manarestore:  Math.floor(casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow / 2),
            healthrestore:0,
            repeat: 5,
            delay: 1000,
            buffname: 0,
            buffamount: 0,
            cooldown: 0,
        }),

        buffMagic: new Buff({
            nameplayer: "Magic Power Buff 50%",
            name: "buffMagicPow",
            nameid: "buff-magic",
            damage: 0,
            manacost: Math.floor(currentplayermana / 2),
            healthcost: 0,
            manarestore: 0,
            healthrestore: 0,
            repeat: 0,
            delay: 0,
            buffname: "buffMagicPow",
            buffamount: Math.floor(casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow /2),
            cooldown: 10000,
            buffduration: 10000,
        }),
    }
}
