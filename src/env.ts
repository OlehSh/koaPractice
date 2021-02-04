import * as path from 'path';
import * as dotenv from 'dotenv';

const inTest = typeof global.it === 'function';
const dotenvPath = inTest ? path.join(__dirname, 'tests', '.env') : path.join(__dirname, '..', '.env');
dotenv.config({ path: dotenvPath });


export default {
    port: process.env.PORT || 4000,
    host: process.env.HOST || 'localhost',
    neo4j: {
        password: process.env.NEO4J_PASSWORD || '',
        host: process.env.NEO4J_HOST || '',
        user: process.env.user || '',
        port: process.env.PORT || 7687,
        dbName: process.env.NEO4J_DB_NAME || 'myapp'
    }
}