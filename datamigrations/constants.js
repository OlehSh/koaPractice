const dotenv = require('dotenv');

dotenv.config({path: '.env'})

module.exports = {
  neo4j: {
    dbName: process.env.NEO4J_DB_NAME || 'neo4j',
    host: process.env.NEO4J_HOST || 'localhost',
    port: process.env.NEO4J_PORT || 7687,
    user: process.env.NEO4J_USER || 'neo4j',
    password: process.env.NEO4J_PASSWORD || ''
  }
}