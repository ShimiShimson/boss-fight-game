import { player } from "./player.js";

export const nerfTimeoutIds = [];

class Boss {
    name = 'Boss';
    stats = {
        level: 1,

        base: {
            totalHP: 100,
            currentHP: 100,
            totalDamage: 80,
        }
    };

    arrayOfNerfNames = Object.keys(player.stats.nerfs);
    excludedStrings = ["nerfHealth", "nerfMana"];
    nerfNames = this.arrayOfNerfNames.filter(nerf => !this.excludedStrings.includes(nerf));
    
    // [
    //     "nerfDamage",
    //     "nerfMagicPow",
    //     "nerfDodge",
    //     "nerfIce",
    //     "nerfFire",
    //     "nerfStorm",
    //     "nerfBlood",
    //     "nerfCritical",
    //     "nerfShadow",
    //     "nerfNature",
    //     "nerfHealPow",
    //     "nerfLifesteal",
    // ];

    copyNerfNames = [...this.nerfNames];

    checkAndCastRandomNerf(player) {

        //TEST NERFING

        // player.stats.nerfs["nerfIce"] = 0.1;
        // setTimeout(() => {
        //     player.stats.nerfs["nerfIce"] = 1;
        //     console.log('UNNERFED', player.stats.nerfs["nerfIce"]);
        // }, 5000);



        // console.log('nerfNames', this.nerfNames);
        const shouldCast = Math.random() < 0.5;
        if (shouldCast) {
            if (this.copyNerfNames.length === 0) {
                this.copyNerfNames = [...this.nerfNames];
            }

            const randomNerfId = Math.floor(Math.random() * this.copyNerfNames.length);

            const randomNerfName = this.copyNerfNames.splice(randomNerfId, 1)[0];
            // console.log('randomNerf', randomNerfName);
            player.stats.nerfs[randomNerfName] = 0.1;
            // console.log('NERFS', player.stats.nerfs)
            // console.log(`${this.name} casts ${randomNerfName}!`);
            // console.log(this.copyNerfNames)

            nerfTimeoutIds.push(setTimeout(() => {
                player.stats.nerfs[randomNerfName] = 1;
                console.log('UNNERFED', randomNerfName, player.stats.nerfs[randomNerfName]);
            }, 10000));

            // console.log('nerfTimeoutIds', nerfTimeoutIds)
        }
    }
}

export const boss = new Boss();