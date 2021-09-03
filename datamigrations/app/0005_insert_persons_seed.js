const { v4 } = require("uuid");
const constants = require('../constants');
const { persons, oneWayRelations, twoWayRelations } = require("../dbseeds/persons.json")
const { replaceWithUuid, getOneWayRelationQuery, getTwoWayRelationQuery } = require("../queryHelper");
module.exports = {
  name: 'Add Persons seeds',
  forward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    const tx = session.beginTransaction()
    await Promise.all(persons.map(person => {
      const uuid = v4()
      const { id, name, lastName, gender, description } = person
      for (const oneWayRelation of oneWayRelations) {
        oneWayRelation.nodeIds = oneWayRelation.nodeIds.map(nodes =>{
          nodes.from = replaceWithUuid(uuid, id, nodes.from)
          nodes.to = replaceWithUuid(uuid, id, nodes.to)
          return nodes
        })
        for (const twoWayRelation of twoWayRelations) {
          twoWayRelation.nodeIds =  twoWayRelation.nodeIds.map(nodes => {
            nodes[0] = replaceWithUuid(uuid, id, nodes[0])
            nodes[1] = replaceWithUuid(uuid, id, nodes[1])
            return nodes
          })
        }
      }
      const parameters = {
        uuid,
        name,
        lastName,
        description: description || '',
        gender
      }
      return tx.run('CREATE (n:Person {id: $uuid, name: $name, lastName: $lastName, gender: $gender, description: $description})', parameters)
    }))
    const worldName = "Amber Chronicles";
    await tx.run('MATCH (n:World {name: $worldName}), (m:Person) CREATE (n)-[r:Character]->(m)', {worldName})
    await Promise.all(oneWayRelations.flatMap(relation => {
      const { nodeIds, nodeLabel, relationLabel } = relation
      return nodeIds.map(node => getOneWayRelationQuery(node, nodeLabel, relationLabel, tx))
    }))
    await Promise.all(twoWayRelations.flatMap(relation => {
      const { nodeIds, nodeLabel, relationLabel } = relation
      return nodeIds.map(node => getTwoWayRelationQuery(node, nodeLabel, relationLabel, tx))
    }))
    await tx.commit();
    session.close();
  },
  backward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    const tx = session.beginTransaction()
    await tx.run(`MATCH (n:Person) DETACH DELETE n`)
    await tx.commit();
    session.close();
  },
};