import { Collection, Db, MongoClient } from 'mongodb';
import { Blog } from '../../blogs/repositories/models/blog.model';
import { Post } from '../../posts/reposytories/models/post.model';
import { SETTINGS } from '../../core/settings/settings';
import { IUserDB } from '../../users/repositories/models/user.db.interface';
import { Comment } from '../../comments/repositories/models/comments.model';
import { Session } from '../../security-devices/repositories/models/session.model';
import { RateLimitLog } from '../rate-limit/rate-limit.model';

const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';
const USER_COLLECTION_NAME = 'users';
const COMMENT_COLLECTION_NAME = 'comments';
const SESSION_COLLECTION_NAME = 'session';
const RAITE_LIMIT_NAME = 'rateLimit';


export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<IUserDB>;
export let commentCollection: Collection<Comment>;
export let sessionCollection: Collection<Session>;
export let rateLimitCollection: Collection<RateLimitLog>;

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
    userCollection = db.collection<IUserDB>(USER_COLLECTION_NAME);
    commentCollection = db.collection<Comment>(COMMENT_COLLECTION_NAME);
    sessionCollection = db.collection<Session>(SESSION_COLLECTION_NAME);
    rateLimitCollection = db.collection<RateLimitLog>(RAITE_LIMIT_NAME );



    console.log('✅ Collections initialized');

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