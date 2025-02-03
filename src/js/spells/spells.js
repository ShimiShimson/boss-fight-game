// @ts-nocheck
import { gameClock } from "../game/clock.js";

import * as BUTTONS from "../ui/buttons.js";
import * as DISPLAYS from "../ui/displays.js";
import * as GLOBALS from '../utils/globals.js';



class Spell {

    constructor({        
        description,
        name,
        nameid,
        actionType,
        costMana,
        costHP,
        restoreMana,
        restoreHP,
        repeat,
        delay,
        cooldown,
        effect
    }) {
        this.description = description;
        this.name = name;
        this.nameid = nameid;
        this.actionType = actionType;
        this.costMana = costMana;
        this.costHP = costHP;
        this.restoreMana = restoreMana;
        this.restoreHP = restoreHP;
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

    applyCostMana(caster, target) {
        console.log('caster', caster)
        if (this.costMana) {
            console.log('MANACOST!', this.costMana * target.stats.level);
            caster.stats.base.currentMana -= this.costMana * target.stats.level;
            console.log('caster.stats.base.currentMana', caster.stats.base.currentMana);
        }
    }

    applyCostHP(caster) {
        if (this.costHP) {
            console.log('HEALTHCOST!');
            caster.stats.base.currentHP -= this.costHP;
        }
    }

    hasEnoughMana (caster, target) {
        console.log('hasEnoughMana')
        console.log(this.costMana)
        if (this.costMana > 0) {
            const costMana = this.costMana * target.stats.level;
            console.log('costMana', costMana);
            console.log('caster.stats.base.currentMana', caster.stats.base.currentMana)
            if (caster.stats.base.currentMana < costMana) {
                console.log(`${caster.name} doesn't have enough mana to cast ${this.description}!`);
                return false;
            }
        }
        return true;
    }

    hasEnoughHP(caster) {
        if (this.costHP) {
            const costHP = caster.stats.base.baseHP / this.costHP; 
            if (caster.stats.base.currentHP < costHP) {
                console.log(`If you cast ${this.description}, it will kill you!`);
                return false;
            }
        }
        return true;
    }

    restoreResource(caster, resource) {
        // console.log('caster', caster);
        console.log('resource', resource);

        console.log(this[`restore${resource}`])

        // console.log(caster);

        const restoreAmount = Math.min(this[`restore${resource}`], caster.stats.base[`total${resource}`] - caster.stats.base[`current${resource}`]);

        console.log('restoreAmount', restoreAmount);

        caster.stats.base[`current${resource}`] += restoreAmount;

        console.log(`${caster.name} restores ${restoreAmount} ${resource}! Current ${resource}: ${caster.stats.base[`current${resource}`]}`);
    }


    cast(caster, target) {
        // console.log('this.costMana', this.costMana);
        // console.log(caster.stats.base.currentMana)
        if (!this.isOffCooldown() || !this.hasEnoughMana(caster, target) || !this.hasEnoughHP(caster)) return false;

        console.log('CASTING...')
        this.lastCastTime = gameClock.getTime();
        this.applyCostHP(caster);
        this.applyCostMana(caster, target);
        // console.log('currentMana', caster.stats.base.currentMana)

        if (this.restoreHP) {
            this.restoreResource(caster, 'HP');
        }

        if (this.restoreMana) {
            this.restoreResource(caster, 'Mana');
        }


        console.log(`${this.name} is cast!`);
        if (typeof this.effect === 'function') {
            this.effect(caster, target);
        }

        DISPLAYS.updateDisplays();

        if (target.stats.base.currentHP <= 0) {
            target.stats.base.currentHP = 0;
            checkandHandleBossDefeat();
        }
        if (caster.stats.base.currentHP <= 0) {
            caster.stats.base.currentHP = 0;
        }

        if (this.actionType === "damage" || this.actionType === "restore") {
            this.displaySpellMessage(caster, target);
        }

        return true;
    };  

    displaySpellMessage(caster, target) {
        const spellColor = this.getSpellColor();
        const spellMessage = `<p style="color: ${spellColor};">${caster.name} casts ${this.description}!</p>`;
        document.getElementById('player-description-div').innerHTML = spellMessage + document.getElementById('player-description-div').innerHTML;
    }

    getSpellColor() {
        switch (this.name) {
            case 'basicAttack':
                return '#8b8b8b';
            case 'iceBolt':
            case 'buffIce':
                return '#41a7e5';
            case 'fireBlast':
            case 'buffFire':
                return '#dc951f';
            case 'stormThunder':
            case 'buffStorm':
                return '#dfd019';
            case 'thorns':
            case 'buffNature':
                return '#1e9e43';
            case 'shadowWord':
            case 'buffShadow':
                return '#924193';
            case 'bloodStrike':
            case 'bloodSap':
                return '#bb0218';
            case 'heal':
            case 'healWings':
            case 'buffHealPow':
            case 'buffHP':
                return '#0ebb02';
            case 'dodge':
                return '#6e727e';
            case 'mageFist':
            case 'buffMagicPow':
                return '#b3aacf';
            case 'manaPotion':
                return '#824588';
            default:
                return 'white';
        }
    }
}

class Buff extends Spell {
    constructor({ 
        description,
        name,
        nameid,
        actionType,
        costMana,
        costHP,
        restoreMana,
        restoreHP,
        cooldown,
        duration,
        buffName,
        buffDuration,
        effect
    }) {
        super({
            description,
            name,
            nameid,
            actionType,
            costMana,
            costHP,
            restoreMana,
            restoreHP,
            repeat: 0, // Default value for Buff
            delay: 0,  // Default value for Buff
            cooldown,
            effect
        });
        this.duration = duration;
        this.buffName = buffName;
        this.buffDuration = buffDuration;
        this.effect = effect || null;
        this.lastCastTime = null;

    }

    applyBuff(caster, target) {
        console.log('APPLY!')
        // if (!this.isOffCooldown()) {
        //     const remainingCooldown = this.cooldown - (gameClock.getTime() - this.lastAppliedTime);
        //     console.log(`${this.name} is on cooldown. (${remainingCooldown / 1000}s remaining)`);
        //     return false;
        // }

        // if(!this.hasEnoughMana(caster) || !this.hasEnoughHP(caster)) {
        //     console.log(`${caster.name} doesn't have enough mana or HP to cast ${this.name}!`);
        // }

        // console.log('applying buff...');
        // this.lastAppliedTime = gameClock.getTime();

        // this.costapplyHP(caster);
        // this.costapplyMana(target);

        // if (typeof this.restoreMana === 'function') {
        //     this.restoreMana();
        // }

        // if (typeof this.restoreHP === 'function') {
        //     this.restoreHP();
        // }
        if (!this.cast(caster, target)) return false;


        if (this.buffName) {
            if(this.buffAmount) {
                caster.stats.buffs[this.buffName] = this.buffAmount;
            } else {
                caster.stats.buffs[this.buffName] = 1.5;
            }
        }

        GLOBALS.buffTimeoutIds.push(setTimeout(() => {
            caster.stats.buffs[this.buffName] = 1;
            BUTTONS.createSpellButtons();
        }, this.buffDuration));

        console.log('caster.stats.buffs.buffIce', caster.stats.buffs.buffIce)

        console.log(`${this.name} applied to ${caster.name}, increasing ${this.buffName.replace('buff', '')} by 50% for ${this.buffDuration / 1000} seconds.`);

        this.displayBuffMessage(caster);

        BUTTONS.createSpellButtons();
        DISPLAYS.updateDisplays();
        return true;
    }

    displayBuffMessage(caster) {
        const spellColor = this.getSpellColor();
        const spellMessage = `<p style="color: ${spellColor};">${caster.name} applies ${this.description}, increasing ${this.buffName.replace('buff', '')} by 50% for ${this.buffDuration / 1000} seconds.</p>`;
        $('player-description-div').prepend(spellMessage);
    }
}



const updateSpells = (caster, target) => {
    console.log('Update Spells')

    const casterTotalHP = caster.stats.base.totalHP;
    const casterCurrentHP = caster.stats.base.currentHP;
    const casterBuffHP = caster.stats.buffs.buffHP;
    const casterNerfHP = caster.stats.nerfs.nerfHP;

    const casterTotalMana = caster.stats.base.totalMana;
    const casterCurrentMana = caster.stats.base.currentMana;
    const casterBuffMana = caster.stats.buffs.buffMana;
    const casterNerfMana = caster.stats.nerfs.nerfMana;

    const casterBaseDMG = caster.stats.base.baseDMG;
    const casterBuffDMG = caster.stats.buffs.buffDMG;
    const casterNerfDMG = caster.stats.nerfs.nerfDMG;

    const casterBaseMagicPow = caster.stats.base.baseMagicPow;
    const casterBuffMagicPow = caster.stats.buffs.buffMagicPow;
    const casterNerfMagicPow = caster.stats.nerfs.nerfMagicPow;

    const casterBaseIceDMG = caster.stats.base.baseIceDMG;
    const casterBuffIce = caster.stats.buffs.buffIce;
    const casterNerfIce = caster.stats.nerfs.nerfIce;

    const casterBaseFireDMG = caster.stats.base.baseFireDMG;
    const casterBuffFire = caster.stats.buffs.buffFire;
    const casterNerfFire = caster.stats.nerfs.nerfFire;

    const casterBaseStormDMG = caster.stats.base.baseStormDMG;
    const casterBuffStorm = caster.stats.buffs.buffStorm;
    const casterNerfStorm = caster.stats.nerfs.nerfStorm;

    const casterBaseNatureDMG = caster.stats.base.baseNatureDMG;
    const casterBuffNature = caster.stats.buffs.buffNature;
    const casterNerfNature = caster.stats.nerfs.nerfNature;

    const casterBaseShadowDMG = caster.stats.base.baseShadowDMG;
    const casterBuffShadow = caster.stats.buffs.buffShadow;
    const casterNerfShadow = caster.stats.nerfs.nerfShadow;

    const casterBaseBloodDMG = caster.stats.base.baseBloodDMG;
    const casterBuffBlood = caster.stats.buffs.buffBlood;
    const casterNerfBlood = caster.stats.nerfs.nerfBlood;

    const casterBaseHealPow = caster.stats.base.baseHealPow;
    const casterBuffHealPow = caster.stats.buffs.buffHealPow;
    const casterNerfHealPow = caster.stats.nerfs.nerfHealPow;

    const casterBaseDodge = caster.stats.base.baseDodge;
    const casterBuffDodge = caster.stats.buffs.buffDodge;
    const casterNerfDodge = caster.stats.nerfs.nerfDodgeChance;

    const casterBaseLifesteal = caster.stats.base.baseLifesteal;
    const casterBuffLifesteal = caster.stats.buffs.buffLifesteal;
    const casterNerfLifesteal = caster.stats.nerfs.nerfLifesteal;



    return {
        // SPELLS
        basicAttack: new Spell({
            description: "Attack",
            name: "basicAttack",
            nameid: "spell-basic",
            actionType: "damage",
            costMana: 0,
            costHP: 0,
            restoreMana: Math.floor(casterTotalMana / 10),
            restoreHP: Math.floor(casterBaseLifesteal * casterBuffLifesteal * casterNerfLifesteal / 2),
            actionType: "damage",
            repeat: 0,
            delay: 0,
            cooldown: 2000,
            effect: (caster, target) => {
                // console.log('casterBaseLifesteal', casterBaseLifesteal);
                // console.log('casterBuffLifesteal', casterBuffLifesteal);
                // console.log('casterNerfLifesteal', casterNerfLifesteal);

                console.log('-----------------------')

                console.log('casterBaseDMG', casterBaseDMG);
                console.log('casterBuffDMG', casterBuffDMG);
                console.log('casterNerfDMG', casterNerfDMG);

                const finalDMG = Math.floor(casterBaseDMG * casterBuffDMG * casterNerfDMG);
                console.log('final BASIC DMG', finalDMG);

                target.stats.base.currentHP -= finalDMG;
            }
        }),



        iceBolt: new Spell({
            description: "Icebolt",
            name: "iceBolt",
            nameid: "spell-ice",
            actionType: "damage",
            costMana: 15,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            cooldown: 5000,
            effect: (caster, target) => {
                console.log(casterBaseIceDMG)
                console.log(casterBuffIce)
                console.log(casterNerfIce)
                
                
                console.log('caster', caster)
                const baseDMG = casterBaseDMG * casterBuffDMG * casterNerfDMG / 2;
                const iceDMG = casterBaseIceDMG * casterBuffIce * casterNerfIce;
                const magicPow = casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow / 2;

                console.log('baseDMG', baseDMG, 'iceDMG', iceDMG, 'magicPow', magicPow)

                const finalDMG = Math.floor((baseDMG + iceDMG + magicPow) * caster.stats.nerfs.nerfIce);

                console.log('final ICE DMG', finalDMG)

                target.stats.base.currentHP -= finalDMG;
                console.log(`${target.name} takes ${finalDMG} ice damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),

        fireBlast: new Spell({
            description: "Fireblast",
            name: "fireBlast",
            nameid: "spell-fire",
            actionType: "damage",
            costMana: 15,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            cooldown: 5000,
            effect: (caster, target) => {
                const baseDMG = casterBaseDMG * casterBuffDMG * casterNerfDMG / 2;
                const fireDMG = casterBaseFireDMG * casterBuffFire * casterNerfFire;
                const magicPow = casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow / 2;

                console.log('baseDMG', baseDMG, 'fireDMG', fireDMG, 'magicPow', magicPow)

                const finalDMG = Math.floor((baseDMG + fireDMG + magicPow) * caster.stats.nerfs.nerfFire);

                console.log('final FIRE DMG', finalDMG)

                target.stats.base.currentHP -= finalDMG;
                console.log(`${target.name} takes ${finalDMG} fire damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),

        stormThunder: new Spell({
            description: "Storm Thunder",
            name: "stormThunder",
            nameid: "spell-storm",
            actionType: "damage",
            costMana: 15,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            cooldown: 5000,
            effect: (caster, target) => {
                const baseDMG = casterBaseDMG * casterBuffDMG * casterNerfDMG / 2;
                const stormDMG = casterBaseStormDMG * casterBuffStorm * casterNerfStorm;
                const magicPow = casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow / 2;

                console.log('baseDMG', baseDMG, 'stormDMG', stormDMG, 'magicPow', magicPow)

                const finalDMG = Math.floor((baseDMG + stormDMG + magicPow) * caster.stats.nerfs.nerfStorm);

                console.log('final STORM DMG', finalDMG)

                target.stats.base.currentHP -= finalDMG;
                console.log(`${target.name} takes ${finalDMG} storm damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),

        thorns: new Spell({
            description: "Thorns Repeat damage",
            name: "thorns",
            nameid: "spell-nature",
            actionType: "damage",
            costMana: 4,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 3,
            delay: 1000,
            cooldown: 5000,
            effect: (caster, target) => {
                const baseDMG = casterBaseDMG * casterBuffDMG * casterNerfDMG / 6;
                const natureDMG = casterBaseNatureDMG * casterBuffNature * casterNerfNature / 3;
                const magicPow = casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow / 6;

                console.log('baseDMG', baseDMG, 'natureDMG', natureDMG, 'magicPow', magicPow)

                const finalDMG = Math.floor((baseDMG + natureDMG + magicPow) * caster.stats.nerfs.nerfNature);

                console.log('final NATURE DMG', finalDMG)

                target.stats.base.currentHP -= finalDMG;
                console.log(`${target.name} takes ${finalDMG} nature damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),

        shadowWord: new Spell({
            description: "Shadow Word",
            name: "shadowWord",
            nameid: "spell-shadow",
            actionType: "damage",
            costMana: 15,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            cooldown: 5000,
            effect: (caster, target) => {
                const baseDMG = casterBaseDMG * casterBuffDMG * casterNerfDMG / 2;
                const shadowDMG = casterBaseShadowDMG * casterBuffShadow * casterNerfShadow;
                const magicPow = casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow / 2;

                console.log('baseDMG', baseDMG, 'shadowDMG', shadowDMG, 'magicPow', magicPow)

                const finalDMG = Math.floor((baseDMG + shadowDMG + magicPow) * caster.stats.nerfs.nerfShadow);

                console.log('final SHADOW DMG', finalDMG)

                target.stats.base.currentHP -= finalDMG;
                console.log(`${target.name} takes ${finalDMG} shadow damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),

        bloodStrike: new Buff({
            description: "Bloodstrike",
            name: "bloodStrike",
            nameid: "spell-blood",
            actionType: "special",
            costMana: 5,
            costHP: target.stats.level * 30,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffLifesteal",
            buffDuration: 8000,
            cooldown: 10000,
            effect: (caster, target) => {
                const baseDMG = casterBaseDMG * casterBuffDMG * casterNerfDMG / 2;
                const bloodDMG = casterBaseBloodDMG * casterBuffBlood * casterNerfBlood;

                console.log('baseDMG', baseDMG, 'bloodDMG', bloodDMG)

                const finalDMG = Math.floor((baseDMG + bloodDMG) * caster.stats.nerfs.nerfBlood);

                console.log('final BLOOD DMG', finalDMG)

                target.stats.base.currentHP -= finalDMG;
                console.log(`${target.name} takes ${finalDMG} blood damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),

        
        heal: new Spell({
            description: "Heal",
            name: "heal",
            nameid: "spell-heal",
            actionType: "restore",
            costMana: 4,
            costHP: 0,
            restoreMana: 0,
            restoreHP: Math.floor(casterBaseHealPow * casterBuffHealPow * casterNerfHealPow * 2),
            repeat: 0,
            delay: 0,
            cooldown: 10000,
        }),

        dodge: new Buff({
            description: "Buff Dodge",
            name: "buffDodge",
            nameid: "buff-dodge",
            actionType: "buff",
            costMana: 15,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffDodge",
            buffDuration: 5000,
            cooldown: 10000,
        }),

        manaPotion: new Spell({
            description: "Mana Potion",
            name: "manaPotion",
            nameid: "spell-mana",
            actionType: "restore",
            costMana: 0,
            costHP: 0,
            restoreMana: Math.floor(casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow * 2),
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            cooldown: 10000,
        }),

        mageFist: new Spell({
            description: "Mage Fist",
            name: "mageFist",
            nameid: "spell-magic",
            actionType: "damage",
            costMana: 10,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            cooldown: 10000,
            effect: (caster, target) => {
                const finalDMG = casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow;

                console.log('final MAGIC DMG', finalDMG)

                target.stats.base.currentHP -= finalDMG;
                console.log(`${target.name} takes ${finalDMG} magic damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),

        spellPlaceholder1: new Spell({
            description: "Placeholder 1",
            name: "spellPlaceholder1",
            nameid: "spell-placeholder1",
            actionType: "damage",
            costMana: 0,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            cooldown: 10000,
            effect: (caster, target) => {
                const finalDMG = 0;

                console.log('final PLACEHOLDER DMG', finalDMG)
            }
        }),


        // 2nd row (buffs)
        buffDMG: new Buff({
            description: "Buff  DMG",
            name: "buffDMG",
            nameid: "buff-basic",
            actionType: "buff",
            costMana: 10,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffDMG",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        buffIce: new Buff({
            description: "Buff Ice DMG",
            name: "buffIce",
            nameid: "buff-ice",
            actionType: "buff",
            costMana: 10,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffIce",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        buffFire: new Buff({
            description: "Buff Fire DMG",
            name: "buffFire",
            nameid: "buff-fire",
            actionType: "buff",
            costMana: 10,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffFire",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        buffStorm: new Buff({
            description: "Buff Storm DMG",
            name: "buffStorm",
            nameid: "buff-storm",
            actionType: "buff",
            costMana: 10,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffStorm",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        buffNature: new Buff({
            description: "Buff Nature DMG",
            name: "buffNature",
            nameid: "buff-nature",
            actionType: "buff",
            costMana: 5,
            costHP: 0,
            restoreMana: 0,
            restoreHP: Math.floor(casterBaseNatureDMG * casterBuffNature * casterNerfNature / 4),
            repeat: 0,
            delay: 0,
            buffName: "buffNature",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        buffShadow: new Buff({
            description: "Buff Shadow DMG",
            name: "buffShadow",
            nameid: "buff-shadow",
            actionType: "buff",
            costMana: 10,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffShadow",
            buffDuration: 8000,
            cooldown: 15000,
        }),


        bloodSap: new Buff({
            description: "Caster sacrifices 25% of their HP to deal BloodDMG 3 times, and heal caster for BloodDMG/3. Also gets buff for BloodDMG",
            name: "bloodSap",
            nameid: "buff-blood",
            actionType: "special",
            costMana: 0,
            costHP: caster.stats.totalHP / 4,
            restoreMana: 0,
            restoreHP: Math.floor(casterBaseLifesteal * casterBuffLifesteal * casterNerfLifesteal / 3),
            repeat: 3,
            delay: 1000,
            buffName: "buffBlood",
            buffDuration: 5000,
            cooldown: 10000,
            effect: (caster, target) => {

                const finalDMG = Math.floor(casterBaseBloodDMG * casterBuffBlood * casterNerfBlood / 2);

                console.log('final BLOOD DMG', finalDMG)

                target.stats.base.currentHP -= finalDMG;
                console.log(`${target.name} takes ${finalDMG} blood damage! Remaining HP: ${target.stats.base.currentHP}`);
            }
        }),

        healWings: new Spell({
            description: "Angel Wings",
            name: "healWings",
            nameid: "buff-heal",
            actionType: "restore",
            damage: 0,
            costMana: () => casterTotalMana / 10,
            costHP: 0,
            restoreMana: 0,
            restoreHP: casterBaseHealPow * casterBuffHealPow * casterNerfHealPow / 5,
            repeat: 5,
            delay: 1000,
            buffName: "buffHealPow",
            buffDuration: 8000,
            cooldown: 15000,
        }),

        helmet: new Buff({
            description: "Vigor Of Vikings",
            name: "helmet",
            nameid: "buff-HP",
            actionType: "buff",
            damage: 0,
            costMana: target.level * 15,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffHP",
            buffAmount: Math.floor(casterTotalMana / 2),
            buffduration: 8000,
            cooldown: 15000,
        }),


        lotus: new Spell({
            description: "Lotus",
            name: "lotus",
            nameid: "spell-lotus",
            actionType: "restore",
            damage: 0,
            costMana: 0,
            costHP: 0,
            restoreMana:  Math.floor(casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow / 2),
            restoreHP:0,
            repeat: 5,
            delay: 1000,
            buffName: 0,
            buffAmount: 0,
            cooldown: 0,
        }),

        buffMagic: new Buff({
            description: "Magic Power Buff",
            name: "buffMagicPow",
            nameid: "buff-magic",
            actionType: "buff",
            damage: 0,
            costMana: () => Math.floor(casterCurrentMana / 2),
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffMagicPow",
            buffDuration: 8000,
            buffAmount: Math.floor(casterBaseMagicPow * casterBuffMagicPow * casterNerfMagicPow /2),
            cooldown: 15000,
        }),

        buffPlaceholder1: new Buff({
            description: "Buff Placeholder 1",
            name: "buffPlaceholder1",
            nameid: "buff-placeholder1",
            actionType: "buff",
            costMana: 0,
            costHP: 0,
            restoreMana: 0,
            restoreHP: 0,
            repeat: 0,
            delay: 0,
            buffName: "buffPlaceholder1",
            buffDuration: 8000,
            cooldown: 15000,
        }),
    }
}

export {
    updateSpells
};

