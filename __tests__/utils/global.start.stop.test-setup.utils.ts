import { runDB, stopDb } from '../../src/db/mongo.db';

let isDBRunning = false;

export async function startTestDB(): Promise<void> {
    if (!isDBRunning) {
        const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/blogger-platform-project';
        await runDB(mongoUrl);
        isDBRunning = true
    }
}

export async function stopTestDB(): Promise<void> {
    if (isDBRunning) {
        await stopDb()
        isDBRunning = false
    }
}