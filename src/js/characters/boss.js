// @ts-ignore
import { player } from "./player.js";
import { fightOver } from "../game/game.js";

import * as BUTTONS from "../ui/buttons.js";
import * as GLOBALS from '../utils/globals.js';
import * as DISPLAYS from "../ui/displays.js";
import { $ } from "../utils/helpers.js";

class Boss {
    name = 'Boss';
    stats = {
        level: 1,

        base: {
            totalHP: 100,
            currentHP: 100,
            baseDMG: 20,
        }
    };

    arrayOfNerfNames = Object.keys(player.stats.nerfs);
    excludedStrings = ["nerfHP", "nerfMana"];
    nerfNames = this.arrayOfNerfNames.filter(nerf => !this.excludedStrings.includes(nerf));
    
    // [
    //     "nerfDMG",
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

    getNerfColor(nerfName) {
        switch (nerfName) {
                case 'nerfIce':
                    return '#41a7e5';
                case 'nerfFire':
                    return '#dc951f';
                case 'nerfStorm':
                    return '#dfd019';
                case 'nerfNature':
                    return '#1e9e43';
                case 'nerfShadow':
                    return '#924193';
                case 'nerfBlood':
                case 'nerfLifesteal':
                case 'nerfCritical':
                    return '#bb0218';
                case 'nerfHealPow':
                    return '#0ebb02';
                case 'nerfDodge':
                    return '#6e727e';
                case 'nerfMagicPow':
                    return '#b3aacf';
                case 'nerfDMG':
                    return '#8b8b8b';
                default:
                    return 'white';
        }
    }
    
    displayNerfMessage(nerfName, type) {

        const newParagraph = document.createElement('p');

        const spellColor = this.getNerfColor(nerfName);

        newParagraph.style.color = spellColor;


        let message = '';

        if (type === 'cast') {
            message = `${this.name} casts ${nerfName}!`;    
        }
        if (type === 'unnerf') {
            message = `${nerfName.replace('nerf', '')} is unnerfed!`;    
            
        }
        newParagraph.innerText = message;

        $('boss-description-div').prepend(newParagraph);
    }

    checkAndCastRandomNerf(player) {

        //TEST NERFING

        // player.stats.nerfs["nerfIce"] = 0.1;
        // setTimeout(() => {
        //     player.stats.nerfs["nerfIce"] = 1;
        //     console.log('UNNERFED', player.stats.nerfs["nerfIce"]);
        // }, 5000);

        const shouldCast = Math.random() < 0.5;
        if (shouldCast) {
            if (this.copyNerfNames.length === 0) {
                this.copyNerfNames = [...this.nerfNames];
            }

            const randomNerfId = Math.floor(Math.random() * this.copyNerfNames.length);

            const randomNerfName = this.copyNerfNames.splice(randomNerfId, 1)[0];
            console.log('randomNerf', randomNerfName);
            player.stats.nerfs[randomNerfName] = 0.1;
            this.displayNerfMessage(randomNerfName, 'cast');
            // console.log('NERFS', player.stats.nerfs)
            // console.log(`${this.name} casts ${randomNerfName}!`);
            // console.log(this.copyNerfNames)
            BUTTONS.createSpellButtons();

            GLOBALS.nerfTimeoutIds.push(setTimeout(() => {
                player.stats.nerfs[randomNerfName] = 1;
                this.displayNerfMessage(randomNerfName, 'unnerf');
                BUTTONS.createSpellButtons();
            }, 10000));

            // console.log('nerfTimeoutIds', nerfTimeoutIds)
        }
    }

    startBossAttackLoop() {
        const bossAttackIntervalId = setInterval(() => {
            boss.checkAndCastRandomNerf(player);
    
            player.stats.base.currentHP -= boss.stats.base.baseDMG;
            DISPLAYS.updateDescription('boss-description-div', `Boss attacks for ${boss.stats.base.baseDMG} DMG!`);
            DISPLAYS.updateDisplays();

            if (player.stats.base.currentHP <= 0) {
                clearInterval(bossAttackIntervalId);
                fightOver();
                player.playerDefeated();
                return;
            }
        }, 2000);

        GLOBALS.setBossAttackIntervalId(bossAttackIntervalId);
    }

    action(player) {

    }

    updateBossOnLevelUp = () => {
        this.stats.base.totalHP = this.stats.level * 100 + (Math.floor(this.stats.level/25)*10000)+(Math.floor(this.stats.level/100)*10000);
        this.stats.base.currentHP = this.stats.base.totalHP;
    
        this.stats.base.baseDMG = this.stats.level * 15 + (Math.floor(this.stats.level/25)*150)+(Math.floor(this.stats.level/100)*150);
    
        // console.log('boss HP',boss.stats.base.totalHP, 'boss DMG', boss.stats.base.baseDMG);
    }
}

export const boss = new Boss();