const constants = require('./constants')
module.exports = {
  name: 'Add profile indexes',
  forward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    const tx = session.beginTransaction()
    await Promise.all([
      tx.run(`CREATE CONSTRAINT profile_id_unique IF NOT EXISTS ON (n:Profile) ASSERT n.id IS UNIQUE`),
      tx.run(`CREATE CONSTRAINT profile_email_unique IF NOT EXISTS ON (n:Profile) ASSERT n.email IS UNIQUE`),
      tx.run(`CREATE CONSTRAINT profile_email_exists IF NOT EXISTS ON (n:Profile) ASSERT exists(n.email)`),
      tx.run(`CREATE CONSTRAINT profile_id_exists IF NOT EXISTS ON (n:Profile) ASSERT exists( n.id)`),
      tx.run(`CREATE CONSTRAINT profile_name_exists IF NOT EXISTS ON (n:Profile) ASSERT exists(n.name)`),
      tx.run(`CREATE CONSTRAINT profile_password_exists IF NOT EXISTS ON (n:Profile) ASSERT exists(n.password)`)
    ])
    tx.commit();
    session.close();
  },
  backward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    const tx = session.beginTransaction()
    await Promise.all([
      tx.run('DROP CONSTRAINT profile_id_unique IF EXISTS'),
      tx.run('DROP CONSTRAINT profile_email_unique IF EXISTS'),
      tx.run('DROP CONSTRAINT profile_email_exists IF EXISTS'),
      tx.run('DROP CONSTRAINT profile_id_exists IF EXISTS'),
      tx.run('DROP CONSTRAINT profile_name_exists IF EXISTS'),
      tx.run('DROP CONSTRAINT profile_password_exists IF EXISTS')
    ])
    tx.commit();
    session.close();
  },
};