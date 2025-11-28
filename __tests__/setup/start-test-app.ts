import { setupApp } from '../../src/setup-app';
import express from 'express';

// ОДНО приложение для ВСЕХ тестовых файлов
const testApp = express();
setupApp(testApp);

export function getTestApp() {
  return testApp;
}
