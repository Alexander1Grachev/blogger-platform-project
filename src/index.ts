import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './core/settings/settings';
import { runDB } from './db/mongo.db';

const bootstrap = async () => {
  // создание приложения
  const app = express();
  setupApp(app);
  // порт приложения
  const PORT = process.env.PORT || 5001;

  console.log('🔄 Starting application...');
  // запуск приложения
  const server = app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });

  // Параллельно подключаем БД с логированием
  console.log('🔄 Attempting to connect to MongoDB...');
  try {
    await runDB(SETTINGS.MONGO_URL);
    console.log('✅ Successfully connected to MongoDB');
  } catch {
    console.error('❌ MongoDB connection failed - check Docker container');
  }
  return { app, server };
};

bootstrap()
  .then(() => console.log('🎯 Application bootstrap completed!'))
  .catch(() => console.log('💥 Failed to bootstrap application'));
