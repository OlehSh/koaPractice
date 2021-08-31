const constants = require('../constants');
module.exports = {
  name: 'Add world indexes',
  forward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    const tx = session.beginTransaction()
    await Promise.all([
      tx.run(`CREATE CONSTRAINT world_id_unique IF NOT EXISTS ON (n:World) ASSERT n.id IS UNIQUE`),
      tx.run(`CREATE CONSTRAINT world_name IF NOT EXISTS ON (n:World) ASSERT exists(n.name)`),
      tx.run(`CREATE CONSTRAINT world_description IF NOT EXISTS ON (n:World) ASSERT exists(n.description)`)
    ])
    await tx.commit();
    session.close();
  },
  backward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    const tx = session.beginTransaction()
    await Promise.all([
      await tx.run(`DROP CONSTRAINT world_id_unique`),
      await tx.run(`DROP CONSTRAINT world_name`),
      await tx.run(`DROP CONSTRAINT world_description`)
    ])
    await tx.commit();
    session.close();
  },
};