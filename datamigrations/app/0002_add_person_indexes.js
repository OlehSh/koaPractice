const constants = require('./constants')
module.exports = {
  name: 'Add person indexes',
  forward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    const tx = session.beginTransaction()
    await Promise.all([
      tx.run(`CREATE CONSTRAINT person_id_unique IF NOT EXISTS ON (n:Person) ASSERT n.id IS UNIQUE`),
      tx.run(`CREATE CONSTRAINT person_name IF NOT EXISTS ON (n:Person) ASSERT exists(n.name)`)
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
      await tx.run(`DROP CONSTRAINT person_id_unique`),
      await tx.run(`DROP CONSTRAINT person_name`)
    ])
    await tx.commit();
    session.close();
  },
};