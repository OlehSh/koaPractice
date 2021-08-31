const constants = require('../constants');
const worlds = require("../dbseeds/worlds.json")
const { v4 } = require("uuid");
module.exports = {
  name: 'Add World indexes',
  forward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    const tx = session.beginTransaction()
    await Promise.all(worlds.map(world => {
      const id = v4()
      const { name, description } = world
      return tx.run(`CREATE (n:World {id: $id, name: $name, description: $description})`, {id, name,description })
    }))
    await tx.commit();
    session.close();
  },
  backward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    const tx = session.beginTransaction()
    await tx.run(`MATCH (n:World) DETACH DELETE n`)
    await tx.commit();
    session.close();
  },
};