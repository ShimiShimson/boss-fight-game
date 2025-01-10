export default class DamageCalculator {
    static calculateDamage(caster, target, elementDamageType) {
        const { total, buffs, nerfs } = caster.stats;

        // Base damage from caster
        let damage = total.totalDamage + total.totalMagicPow / 2;

        // Elemental damage type (e.g., ice, fire, etc.)
        if (elementDamageType) {
            damage += total[`total${elementDamageType}DMG`] || 0;
            damage += buffs[`buff${elementDamageType}DMG`] || 0;
            damage -= nerfs[`nerf${elementDamageType}DMG`] || 0;
        }

        // Apply buffs and nerfs to total damage
        damage += buffs.buffDamage || 0;
        damage -= nerfs.nerfDamage || 0;

        // Factor in target defenses if needed (e.g., armor, resistances)
        damage = Math.max(0, damage - target.defense);

        return Math.floor(damage); // Return final damage as an integer
    }
}