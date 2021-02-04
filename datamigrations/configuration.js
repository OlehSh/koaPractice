const neo4j = require('neo4j-driver');
/**
 * Neo4j driver configuration
 *
 * Return: configured neo4j driver.
 */
const dbName = 'myapp';

const driver = neo4j.driver(`bolt://localhost:7687`, neo4j.auth.basic('app_test', '12345678'));
module.exports = () => driver;