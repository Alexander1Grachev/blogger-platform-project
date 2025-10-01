import { startTestDB, stopTestDB } from '../utils/global.start.stop.test-setup.utils';

// Глобальная настройка перед всеми тестами
beforeAll(async () => {
    console.log('Global setup: starting DB...');
    await startTestDB();
});
// Глобальная очистка после всех тестов
afterAll(async () => {
    console.log('Global teardown: stopping DB...');
    await stopTestDB();
});