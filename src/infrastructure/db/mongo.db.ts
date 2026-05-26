
import mongoose from 'mongoose'

export async function runDB(url: string): Promise<void> {
  console.log('🔗 Connecting to database:', url);

  try {
    await mongoose.connect(url);
    console.log('✅ Mongoose client connected');

    await mongoose.connection.db!.command({ ping: 1 });
    console.log('✅ Database ping successful');
    console.log('✅ Connected to the database');
  } catch (e) {
    console.error('❌ Database connection error:', e);
    await mongoose.disconnect()
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

/* для тестов 
readyState возвращает число:
0 — disconnected
1 — connected
2 — connecting
3 — disconnecting
*/
export async function stopDb() {
  const readyState = mongoose.connection.readyState
  if (readyState !== 1) {
    console.error('❌ No active client to stop');
    throw new Error(`❌ No active client`);
  }
  await mongoose.disconnect()
  console.log('✅ Database connection closed');
}