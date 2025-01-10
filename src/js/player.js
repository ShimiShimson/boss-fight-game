
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



    total: {
        totalHP: 1000,
        currentHP: 900,
        totalMana: 50,
        currentMana: 50,
        totalDodge: 0,
        totalMagicPow: 10,
        totalDamage: 40,
        totalIceDMG: 10,
        totalFireDMG: 0,
        totalStormDMG: 0,
        totalCritical: 0,
        totalBloodDMG: 0,
        totalShadowDMG: 0,
        totalNatureDMG: 0,
        totalHealPow: 0,
        totalLifesteal: 10,
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
        buffHealth: 1,
        buffMana: 1,
        buffDamage: 1,
        buffMagicPow: 1,
        buffDodge: 1,
        buffIce: 1,
        buffFire: 1,
        buffStorm: 1,
        buffBlood: 1,
        buffCritical: 1,
        buffShadow: 1,
        buffNature: 1,
        buffHealPow: 1,
        buffLifesteal: 1,
    },

    nerfs: {
        nerfHealth: 1,
        nerfMana: 1,
        nerfDamage: 1,
        nerfMagicPow: 1,
        nerfDodge: 1,
        nerfIce: 1,
        nerfFire: 1,
        nerfStorm: 1,
        nerfBlood: 1,
        nerfCritical: 1,
        nerfShadow: 1,
        nerfNature: 1,
        nerfHealPow: 1,
        nerfLifesteal: 1,
    }
}

export const player = new Player("Player", playerStats);

