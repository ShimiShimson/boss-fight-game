
class Player {
    constructor(name, stats) {
        this.name = name;
        this.stats = stats;
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

}




const playerStats = {
    level: 1,
    gold: 0,
    experience: 0,



    base: {
        totalHP: 1000,
        currentHP: 900,
        totalMana: 50,
        currentMana: 50,
        baseDamage: 10,
        baseMagicPow: 10,
        baseIceDMG: 10,
        baseFireDMG: 0,
        baseStormDMG: 0,
        baseCritical: 0,
        baseBloodDMG: 0,
        baseShadowDMG: 0,
        baseNatureDMG: 0,
        baseHealPow: 0,
        baseLifesteal: 10,
        baseDodge: 0,
    },


    buffs: {
        buffHealth: 1,
        buffMana: 1,
        buffDamage: 1,
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
        nerfHealth: 1,
        nerfMana: 1,
        nerfDamage: 1,
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
    },
}

export const player = new Player("Player", playerStats);

