import * as dotenv from 'dotenv';
import * as path from 'path';

// Load initial environment variables from .env
console.log('Loading environment configuration...');
dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    browser: process.env.BROWSER || 'chromium',
    headless: process.env.HEADLESS === 'true',
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT || '5432', 10),
    dbUser: process.env.DB_USER || 'testuser',
    dbPassword: process.env.DB_PASSWORD || 'testpass',
    dbName: process.env.DB_NAME || 'testdb',
};
