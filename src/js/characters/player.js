import { gameClock } from "../game/clock.js";
import { modal } from "../ui/modal.js";

class Player {
    constructor(name) {
        this.name = name;
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


    stats = {
        level: 1,
        gold: 0,
        experience: 0,


        base: {
            totalHP: 0,
            currentHP: 0,
            totalMana: 0,
            currentMana: 0,
            baseDMG: 0,
            baseMagicPow: 0,
            baseIceDMG: 0,
            baseFireDMG: 0,
            baseStormDMG: 0,
            baseCritical: 0,
            baseBloodDMG: 0,
            baseShadowDMG: 0,
            baseNatureDMG: 0,
            baseHealPow: 0,
            baseLifesteal: 0,
            baseDodge: 0,
        },


        buffs: {
            buffHP: 1,
            buffMana: 1,
            buffDMG: 1,
            buffMagicPow: 1,
            buffIce: 1,
            buffFire: 1,
            buffStorm: 1,
            buffBlood: 1,
            buffCritical: 1,
            buffShadow: 1,
            buffNature: 1,
            buffHealPow: 1,
            buffLifesteal: 1,
            buffDodge: 1,
        },

        nerfs: {
            nerfHP: 1,
            nerfMana: 1,
            nerfDMG: 1,
            nerfMagicPow: 1,
            nerfIce: 1,
            nerfFire: 1,
            nerfStorm: 1,
            nerfBlood: 1,
            nerfCritical: 1,
            nerfShadow: 1,
            nerfNature: 1,
            nerfHealPow: 1,
            nerfLifesteal: 1,
            nerfDodge: 1,
        }
    }

    playerDefeated() {
        gameClock.stop();
        modal.showModal('You are defeated. Would you like to try again?');
    }
}


export const updatePlayerOnLevelUp = (player) => {
    player.stats.base.totalHP = 200 * player.stats.level;
    player.stats.base.currentHP = player.stats.base.totalHP;
    player.stats.base.totalMana = 100 * player.stats.level;
    player.stats.base.currentMana = player.stats.base.totalMana;

    player.stats.base.baseDMG = 10 * player.stats.level;
    player.stats.base.baseMagicPow = 10 * player.stats.level;
    player.stats.base.baseIceDMG = 5 * player.stats.level;
    player.stats.base.baseFireDMG = 5 * player.stats.level;
    player.stats.base.baseStormDMG = 5 * player.stats.level;
    player.stats.base.baseCritical = 5 * player.stats.level;
    player.stats.base.baseBloodDMG = 5 * player.stats.level;
    player.stats.base.baseShadowDMG = 5 * player.stats.level;
    player.stats.base.baseNatureDMG = 5 * player.stats.level;
    player.stats.base.baseHealPow = 5 * player.stats.level;
    player.stats.base.baseLifesteal = 5 * player.stats.level;
    player.stats.base.baseDodge = 5 * player.stats.level;

    player.stats.buffs = {
        buffHP: 1,
        buffMana: 1,
        buffDMG: 1,
        buffMagicPow: 1,
        buffIce: 1,
        buffFire: 1,
        buffStorm: 1,
        buffBlood: 1,
        buffCritical: 1,
        buffShadow: 1,
        buffNature: 1,
        buffHealPow: 1,
        buffLifesteal: 1,
        buffDodge: 1,
    };

    player.stats.nerfs = {
        nerfHP: 1,
        nerfMana: 1,
        nerfDMG: 1,
        nerfMagicPow: 1,
        nerfIce: 1,
        nerfFire: 1,
        nerfStorm: 1,
        nerfBlood: 1,
        nerfCritical: 1,
        nerfShadow: 1,
        nerfNature: 1,
        nerfHealPow: 1,
        nerfLifesteal: 1,
        nerfDodge: 1,
    };
}

export const player = new Player("Player");
