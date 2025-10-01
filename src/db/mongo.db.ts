import { Collection, Db, MongoClient } from 'mongodb';
import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';
import { SETTINGS } from '../core/settings/settings';

const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
    console.log('🔗 Connecting to database:', url);
    client = new MongoClient(url);


    try {
        await client.connect(); // ПОДКЛЮЧЕНИЕ ПЕРВЫМ!
        console.log('✅ MongoDB client connected');

        const db: Db = client.db(SETTINGS.DB_NAME);
        console.log('✅ Database instance created:', SETTINGS.DB_NAME);

        // Инициализация коллекций
        blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
        postCollection = db.collection<Post>(POST_COLLECTION_NAME);

        console.log('✅ Collections initialized:', {
            drivers: !!blogCollection,
            rides: !!postCollection
        });

        await db.command({ ping: 1 });
        console.log('✅ Database ping successful');
        console.log('✅ Connected to the database');
    } catch (e) {
        console.error('❌ Database connection error:', e);
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}

// для тестов
export async function stopDb() {
    if (!client) {
        console.error('❌ No active client to stop');
        throw new Error(`❌ No active client`);
    }
    await client.close();
    console.log('✅ Database connection closed');
}