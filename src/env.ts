import  path from 'path';
import dotenv from 'dotenv';

const inTest = typeof global.it === 'function';
const dotenvPath = inTest ? path.join(__dirname, 'tests', '.env') : path.join(__dirname, '..', '.env');
dotenv.config({path: dotenvPath});
// console.log(process.env)
export default {
  saltRounds: process.env.SALT_ROUNDS || 16,
  port: process.env.PORT || 3000,
  authStrategy: process.env.AUTH_STRATEGY || 'local',
  secretKey: process.env.SECRET_KEY || 'default_secret',
  neo4j: {
    password: process.env.NEO4J_PASSWORD || '',
    host: process.env.NEO4J_HOST || '',
    user: process.env.NEO4J_USER || '',
    port: process.env.NEO4J_PORT || 7687,
    dbName: process.env.NEO4J_DB_NAME || 'myapp'
  }
}