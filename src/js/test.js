export function handleAction(spell, player, boss, gameState) {
    // Ensure the spell is not on cooldown
    if (gameState.cooldowns[spell.namefunction]) {
        $('player-description').prepend(`${spell.namefunction} is on cooldown!<br>`);
        return;
    }

    // Deduct costs
    if (spell.manacost > player.currentMana || spell.healthcost > player.currentHp) {
        $('player-description').prepend("Not enough resources to cast this spell!<br>");
        return;
    }
    player.currentMana -= spell.manacost;
    player.currentHp -= spell.healthcost;

    // Perform actions based on spell type
    if (spell.damage > 0) applyDamageToBoss(spell, boss);
    if (spell.healthrestore > 0) applyHealing(spell, player);
    if (spell.manarestore > 0) applyManaRestoration(spell, player);
    if (spell.buffname) applyBuff(spell, player, gameState);
    if (spell.repeat > 0) {
        if (spell.damage > 0) applyDoT(spell, boss, gameState);
        if (spell.healthrestore > 0) applyHoT(spell, player, gameState);
    }

    // Add cooldown
    gameState.cooldowns[spell.namefunction] = spell.cooldown;
}

function applyDamageToBoss(spell, boss) {
    const finalDamage = Math.max(spell.damage - boss.fireResistance, 0); // Example resistance check
    boss.currentHp = Math.max(boss.currentHp - finalDamage, 0);
    $('boss-description').prepend(`Dealt ${finalDamage} damage to the boss. Boss HP: ${boss.currentHp}<br>`);
}

function applyHealing(spell, player) {
    const prevHp = player.currentHp;
    player.currentHp = Math.min(player.currentHp + spell.healthrestore, player.maxHp);
    $('player-description').prepend(`Healed player for ${spell.healthrestore}. Player HP: ${player.currentHp} (was ${prevHp})<br>`);
}

function applyManaRestoration(spell, player) {
    const prevMana = player.currentMana;
    player.currentMana = Math.min(player.currentMana + spell.manarestore, player.maxMana);
    $('player-description').prepend(`Restored ${spell.manarestore} mana to the player. Player Mana: ${player.currentMana} (was ${prevMana})<br>`);
}

function applyBuff(spell, player, gameState) {
    gameState.activeBuffs.push({
        buffName: spell.buffname,
        amount: spell.buffamount,
        duration: spell.buffduration,
    });
    $('player-description').prepend(`Applied buff ${spell.buffname} with value ${spell.buffamount} for ${spell.buffduration}ms<br>`);
}

function applyDoT(spell, boss, gameState) {
    const dot = { damage: spell.damage, repeat: spell.repeat, delay: spell.delay, boss, intervalId: null };
    dot.intervalId = setInterval(() => {
        if (dot.repeat <= 0) {
            clearInterval(dot.intervalId);
            return;
        }
        applyDamageToBoss(spell, boss);
        dot.repeat--;
    }, spell.delay);
    gameState.activeDoTs.push(dot);
    $('boss-description').prepend(`Started DoT effect: ${spell.damage} damage every ${spell.delay}ms for ${spell.repeat} ticks.<br>`);
}

function applyHoT(spell, player, gameState) {
    const hot = { heal: spell.healthrestore, repeat: spell.repeat, delay: spell.delay, player, intervalId: null };
    hot.intervalId = setInterval(() => {
        if (hot.repeat <= 0) {
            clearInterval(hot.intervalId);
            return;
        }
        applyHealing(spell, player);
        hot.repeat--;
    }, spell.delay);
    gameState.activeHoTs.push(hot);
    $('player-description').prepend(`Started HoT effect: ${spell.healthrestore} healing every ${spell.delay}ms for ${spell.repeat} ticks.<br>`);
}
