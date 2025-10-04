
import dotenv from 'dotenv'
dotenv.config()


export const SETTINGS = {
    PORT: process.env.PORT || 5001,
    MONGO_URL:
        process.env.MONGO_URL || 'mongodb://localhost:27017/blogger-platform-project',
    DB_NAME: process.env.DB_NAME || 'blogger-platform-project',
};