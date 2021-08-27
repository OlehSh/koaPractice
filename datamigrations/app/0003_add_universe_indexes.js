const constants = require('../constants');
module.exports = {
  name: 'Add universe indexes',
  forward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    const tx = session.beginTransaction()
    await Promise.all([
      tx.run(`CREATE CONSTRAINT universe_id_unique IF NOT EXISTS ON (n:Universe) ASSERT n.id IS UNIQUE`),
      tx.run(`CREATE CONSTRAINT universe_name IF NOT EXISTS ON (n:Universe) ASSERT exists(n.name)`),
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
      await tx.run(`DROP CONSTRAINT universe_id_unique`),
      await tx.run(`DROP CONSTRAINT universe_name`)
    ])
    await tx.commit();
    session.close();
  },
};