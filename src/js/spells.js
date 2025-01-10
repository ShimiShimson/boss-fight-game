import { player } from "./player.js";
import { gameClock } from "./clock.js";
import { $ } from "./helpers.js";

class Spell {
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
        buffname,
        buffamount,
        buffduration,
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
        this.buffname = buffname;
        this.buffamount = buffamount;
        this.buffduration = buffduration;
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

    hasEnoughMana (caster) {
        if (caster.stats.total.currentMana < this.manacost) {
            console.log(`${caster.name} doesn't have enough mana to cast ${this.description}!`);
            return false;
        }
        return true;
    }


    cast(caster, target) {
        // console.log('this.manacost', this.manacost);
        // console.log(caster.stats.total.currentMana)
        if (!this.isOffCooldown() || !this.hasEnoughMana(caster)) return false;

        console.log('casting...')
        this.lastCastTime = gameClock.getTime();
        // console.log('currentMana', caster.stats.total.currentMana)
        caster.stats.total.currentMana -= this.manacost * target.stats.level;

        // console.log('caster.stats.total.currentMana', caster.stats.total.currentMana);

        console.log(`${this.name} is cast!`);
        this.effect(caster, target);
    }
}



export const spells = {
    restoreHealth: function(caster) {
        const lifesteal = Math.floor((caster.stats.total.totalLifesteal * caster.stats.buffs.buffLifesteal * caster.stats.nerfs.nerfLifesteal) / 4);



        // console.log('lifesteal', lifesteal)
        let currentHP = caster.stats.total.currentHP;
        const totalHP = caster.stats.total.totalHP;
        console.log('------------------------------');

        currentHP += lifesteal;
        console.log('currentHP', currentHP)
        if (currentHP > totalHP) {
            currentHP = totalHP;
        }
    },

    restoreMana: function(caster) {
        let currentMana = caster.stats.total.currentMana;
        const totalMana = caster.stats.total.totalMana;

        console.log('currentMana', currentMana);

        currentMana += Math.floor(totalMana/10);
        if (currentMana > totalMana) {
            currentMana = totalMana;
        }
        console.log(`${caster.name} restores ${Math.floor(totalMana/10)} mana! Current mana: ${caster.stats.total.currentMana}`);

        // console.log('currentMana', currentMana);
    },

    basicAttack: new Spell({
        description: "Attack",
        name: "basicAttack",
        nameid: "spell-basic",
        manacost: 0,
        healthcost: 0,
        cooldown: 2000,
        effect: (caster, target) => {
            spells.restoreHealth(caster);
            spells.restoreMana(caster);
                

            const finalDamage = Math.floor(caster.stats.total.totalDamage * caster.stats.buffs.buffDamage * caster.stats.nerfs.nerfDamage);
            console.log('final BASIC Damage', finalDamage)

            target.stats.total.currentHP -= finalDamage;

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
        buffname: "",
        buffamount: 0,
        buffduration: undefined,
        cooldown: 5000,
        effect: (caster, target) => {
            
            const totalDamage = (caster.stats.total.totalDamage / 2) * caster.stats.buffs.buffDamage * caster.stats.nerfs.nerfDamage;
            const iceDMG = caster.stats.total.totalIceDMG * caster.stats.buffs.buffIce * caster.stats.nerfs.nerfIce;
            const magicPow = (caster.stats.total.totalMagicPow / 2) * caster.stats.buffs.buffMagicPow * caster.stats.nerfs.nerfMagicPow;

            const finalDamage = Math.floor(totalDamage + iceDMG + magicPow);

            target.stats.total.currentHP -= finalDamage;
            console.log(`${target.name} takes ${finalDamage} ice damage! Remaining HP: ${target.stats.total.currentHP}`);
        }
    })


    // export const spellobject = {

    //     basicattack: {
    //       description: "Attack",
    //       name: "basicattack",
    //       nameid: ".-basic",
    //       actionType: "damage",
    //       damage: Damage,
    //       manacost: 0,
    //       healthcost: 0,
    //       manarestore: Math.floor(Mana/10),
    //       healthrestore: Math.floor(Lifesteal/4),
    //       repeat: 0,
    //       delay: 0,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 2000,
    //     },

    //     icebolt: {
    //       description: "Icebolt",
    //       name: "icebolt",
    //       nameid: "#icebolt",
    //       actionType: "damage",
    //       damage: Math.floor(Damage/2 + IceDMG + MagicPow/2) ,
    //       manacost: boss.level * 15,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 5000,
    //     },

    //     firebolt: {
    //       description: "Firebolt",
    //       name: "firebolt",
    //       nameid: "#firebolt",
    //       actionType: "damage",
    //       damage: Math.floor(Damage/2 + FireDMG + MagicPow/2) ,
    //       manacost: boss.level * 15,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 5000,
    //     },


    //     stormbolt: {
    //       description: "Stormbolt",
    //       name: "stormbolt",
    //       nameid: "#stormbolt",
    //       actionType: "damage",
    //       damage: Math.floor(Damage/2 + StormDMG + MagicPow/2) ,
    //       manacost: boss.level * 15,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 5000,
    //     },


    //     shadowbolt: {
    //       description: "Shadowbolt",
    //       name: "shadowbolt",
    //       nameid: "#shadowbolt",
    //       actionType: "damage",
    //       damage: Math.floor(Damage/2 + ShadowDMG + MagicPow/2) ,
    //       manacost: boss.level * 15,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 2000,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 5000,
    //     },


    //     bloodstrike: {
    //       description: "Bloodstrike",
    //       name: "bloodstrike",
    //       nameid: "#bloodstrike",
    //       actionType: "damage",
    //       damage: Math.floor(BloodDMG + Damage),
    //       manacost: boss.level * 5,
    //       healthcost: boss.level * 30,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: "buffLifesteal",
    //       buffamount: Math.floor(BloodDMG / 2),
    //       cooldown: 5000,
    //     },

    //     thorns: {
    //       description: "Thorns",
    //       name: "thorns",
    //       nameid: "#thorns",
    //       actionType: "damage",
    //       damage: Math.floor(Damage/6 + NatureDMG/3 + MagicPow/6) ,
    //       manacost: boss.level * 4,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 3,
    //       delay: 1000,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 5000,
    //     },

    //     natureheal: {
    //       description: "Natureheal",
    //       name: "natureheal",
    //       nameid: "#natureheal",
    //       actionType: "heal",
    //       damage: 0,
    //       manacost: boss.level * 5,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: Math.floor(NatureDMG/4),
    //       repeat: 3,
    //       delay: 1000,
    //       buffname: "buffNatureDMG",
    //       buffamount: Math.floor(NatureDMG),
    //       buffduration: 5000,
    //       cooldown: 10000,
    //     },

    //     heal: {
    //       description: "Heal",
    //       name: "heal",
    //       nameid: "#heal",
    //       actionType: "heal",
    //       damage: 0,
    //       manacost: boss.level * 4,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: HealPow*2,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 10000,
    //     },

    //     dodge: {
    //       description: "Dodge",
    //       name: "dodge",
    //       nameid: "#dodge",
    //       actionType: "buff",
    //       damage: 0,
    //       manacost: boss.level * 15,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: "buffDodge",
    //       buffamount: 100,
    //       cooldown: 10000,
    //       buffduration: 5000,

    //     },

    //     manarestore: {
    //       description: "Manarestore",
    //       name: "manarestore",
    //       nameid: "#manarestore",
    //       actionType: "mana",
    //       damage: 0,
    //       manacost: 0,
    //       healthcost: 0,
    //       manarestore:  Math.floor(MagicPow/2),
    //       healthrestore:0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 10000,
    //     },

    //     lotus: {
    //       description: "Lotus",
    //       name: "lotus",
    //       nameid: "#lotus",
    //       actionType: "mana",
    //       damage: 0,
    //       manacost: 0,
    //       healthcost: 0,
    //       manarestore:  Math.floor(MagicPow/2),
    //       healthrestore:0,
    //       repeat: 5,
    //       delay: 1000,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 0,
    //     },

    //     buffmagic: {
    //       description: "Magic Bottle",
    //       name: "buffmagic",
    //       nameid: "#buffmagic",
    //       actionType: "buff",
    //       damage: 0,
    //       manacost: boss.level * 25,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: "buffMagicPow",
    //       buffamount: Math.floor(MagicPow/2),
    //       cooldown: 10000,
    //       buffduration: 5000,
    //     },

    //     icebuff: {
    //       description: "Ice Mask",
    //       name: "icebuff",
    //       nameid: "#icebuff",
    //       actionType: "buff",
    //       damage:  0,
    //       manacost: boss.level * 10,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: "buffIceDMG",
    //       buffamount: Math.floor(IceDMG),
    //       cooldown: 10000,
    //       buffduration: 5000,
    //     },

    //     firebuff: {
    //       description: "Hand of Fire",
    //       name: "firebuff",
    //       nameid: "#firebuff",
    //       actionType: "buff",
    //       damage: 0,
    //       manacost: boss.level * 10,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: "buffFireDMG",
    //       buffamount: Math.floor(FireDMG),
    //       cooldown: 10000,
    //       buffduration: 5000,
    //     },

    //     shadowbuff: {
    //       description: "Eye of Shadow",
    //       name: "shadowbuff",
    //       nameid: "#shadowbuff",
    //       actionType: "buff",
    //       damage:  0,
    //       manacost: boss.level * 10,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: "buffShadowDMG",
    //       buffamount: Math.floor(ShadowDMG),
    //       cooldown: 10000,
    //       buffduration: 5000,
    //     },

    //     stormbuff: {
    //       description: "Tree of Storm",
    //       name: "stormbuff",
    //       nameid: "#stormbuff",
    //       actionType: "buff",
    //       damage: 0,
    //       manacost: boss.level * 10,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: "buffStormDMG",
    //       buffamount: Math.floor(StormDMG ),
    //       cooldown: 10000,
    //       buffduration: 5000,
    //     },

    //     magebuff: {
    //       description: "Mage Burst",
    //       name: "magebuff",
    //       nameid: "#magebuff",
    //       damage: 0,
    //       manacost: Math.floor(currentplayermana / 2),
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: "buffMagicPow",
    //       buffamount: Math.floor(MagicPow /2),
    //       cooldown: 10000,
    //       buffduration: 10000,
    //     },

    //     bloodsap: {
    //       description: "Blood Sap",
    //       name: "buffBlood",
    //       nameid: "#buffBlood",
    //       damage: Math.floor(BloodDMG/3),
    //       manacost: 0,
    //       healthcost: Math.floor(Health / 4),
    //       manarestore: 0,
    //       healthrestore: Math.floor(BloodDMG/3),
    //       repeat: 3,
    //       delay: 1000,
    //       buffname: "buffBloodDMG",
    //       buffamount: Math.floor(BloodDMG ),
    //       cooldown: 10000,
    //       buffduration: 5000,
    //     },

    //     healwings: {
    //       description: "Heal Wings",
    //       name: "healwings",
    //       nameid: "#healwings",
    //       damage: 0,
    //       manacost: Math.floor(Mana / 10),
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: HealPow,
    //       repeat: 5,
    //       delay: 800,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 10000,
    //     },

    //     defenseheal: {
    //       description: "Palace of Gods",
    //       name: "defenseheal",
    //       nameid: "#defenseheal",
    //       damage: 0,
    //       manacost: boss.level*7,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: Math.floor(HealPow/2),
    //       repeat: 3,
    //       delay: 1000,
    //       buffname: "buffDodge",
    //       buffamount: 30,
    //       buffduration: 4000,
    //       cooldown: 10000,
    //     },

    //     attackbuff: {
    //       description: "Damage Buff",
    //       name: "attackbuff",
    //       nameid: "#attackbuff",
    //       damage: 0,
    //       manacost: boss.level * 15,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: "buffDamage",
    //       buffamount: Math.floor(Damage),
    //       cooldown: 10000,
    //       buffduration: 10000,
    //     },

    //     helmet: {
    //       description: "Vigor Of Vikings",
    //       name: "helmet",
    //       nameid: "#helmet",
    //       damage: 0,
    //       manacost: boss.level * 15,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: "buffHealth",
    //       buffamount: Math.floor(Mana / 2),
    //       cooldown: 10000,
    //       buffduration: 15000,
    //     },

    //     magicattack: {
    //       description: "Finger Bolt",
    //       name: "magicattack",
    //       nameid: "#magicattack",
    //       damage: MagicPow,
    //       manacost: boss.level * 10,
    //       healthcost: 0,
    //       manarestore: 0,
    //       healthrestore: 0,
    //       repeat: 0,
    //       delay: 0,
    //       buffname: 0,
    //       buffamount: 0,
    //       cooldown: 7000,
    //       buffduration: 0,
    //     },


    //   }

}
