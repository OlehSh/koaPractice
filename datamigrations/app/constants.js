const dotenv = require('dotenv');

dotenv.config({path: '.env'})

module.exports = {
  neo4j: {
    dbName: process.env.NEO4J_DB_NAME
  }
}