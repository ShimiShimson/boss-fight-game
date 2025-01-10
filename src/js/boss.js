class Boss {
    name = 'Boss';
    stats = {
        level: 1,

        total: {
            totalHP: 100,
            currentHP: 100,
            totalDamage: 20,
        }
    }

}

export const boss = new Boss();