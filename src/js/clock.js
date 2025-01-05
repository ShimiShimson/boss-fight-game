class GameClock {
    constructor() {
        this.elapsedTime = 0; // Total elapsed time in milliseconds
        this.interval = null;
    }

    start() {
        this.interval = setInterval(() => {
            this.elapsedTime += 100; // Increment by 100ms
        }, 100);
    }

    stop() {
        clearInterval(this.interval);
    }

    getTime() {
        return this.elapsedTime; // Return elapsed time in milliseconds
    }
}

export const gameClock = new GameClock();