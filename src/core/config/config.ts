import { config } from 'dotenv'

config()
function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`❌ Missing env variable: ${key}`);
    }
    return value;
}

export const appConfig = {
    PORT: Number(process.env.PORT) || 5000,

    MONGO_URL: getEnvVar('MONGO_URL'),
    DB_NAME: getEnvVar('DB_NAME'),

    AC_SECRET: getEnvVar('AC_SECRET'),
    RT_SECRET: getEnvVar('RT_SECRET'),

    AC_TIME: Number(getEnvVar('AC_TIME')),
    RT_TIME: Number(getEnvVar('RT_TIME')),

    DB_TYPE: process.env.DB_TYPE || 'dev',

    EMAIL: getEnvVar('EMAIL'),
    EMAIL_PASS: getEnvVar('EMAIL_PASS'),

    NODE_ENV: process.env.NODE_ENV || 'development',
};