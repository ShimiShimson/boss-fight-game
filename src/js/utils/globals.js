
let bossAttackIntervalId = null;


function setBossAttackIntervalId(id) {
    bossAttackIntervalId = id;
}

const nerfTimeoutIds = [];
const buffTimeoutIds = [];


export {
    bossAttackIntervalId,
    setBossAttackIntervalId,
    nerfTimeoutIds,
    buffTimeoutIds
}