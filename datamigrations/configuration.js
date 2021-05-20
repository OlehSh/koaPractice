const neo4j = require('neo4j-driver');
const constants = require('./constants')
/**
 * Neo4j driver configuration
 *
 * Return: configured neo4j driver.
 */
const driver = neo4j.driver(
  `bolt://${constants.neo4j.host}:${constants.neo4j.port}`,
  neo4j.auth.basic(constants.neo4j.user, constants.neo4j.password));
module.exports = () => driver;