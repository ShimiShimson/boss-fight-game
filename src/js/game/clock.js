class GameClock {
    constructor() {
        this.elapsedTime = 0; // Total elapsed time in milliseconds
        this.interval = null;
        this.elapsedInterval = null;
    }

    start() {
        this.interval = setInterval(() => {
            this.elapsedTime += 100; // Increment by 100ms
        }, 100);
        this.elapsedInterval = setInterval(() => {
            console.log(`Elapsed time: ${this.elapsedTime}`);
        }, 1000);

    }

    stop() {
        clearInterval(this.interval);
        clearInterval(this.elapsedInterval);
    }

    getTime() {
        return this.elapsedTime; // Return elapsed time in milliseconds
    }
}

export const gameClock = new GameClock();