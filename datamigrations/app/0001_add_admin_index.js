const constants = require('./constants')
module.exports = {
  name: 'Add a',
  forward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    await session.run(`CREATE CONSTRAINT profile_email_unique IF NOT EXISTS ON (n:Profile) ASSERT n.email IS UNIQUE`);
    await session.run(`CREATE CONSTRAINT profile_email_exists IF NOT EXISTS ON (n:Profile) ASSERT exists(n.email)`);
    await session.run(`CREATE CONSTRAINT profile_id_exists IF NOT EXISTS ON (n:Profile) ASSERT exists( n.id)`);
    await session.run(`CREATE CONSTRAINT profile_name_exists IF NOT EXISTS ON (n:Profile) ASSERT exists(n.name)`);
    await session.run(`CREATE CONSTRAINT profile_password_exists IF NOT EXISTS ON (n:Profile) ASSERT exists(n.password)`);
    session.close();
  },
  backward: async (driver) => {
    const session = driver.session({
      database: constants.neo4j.dbName
    });
    await session.run('DROP CONSTRAINT profile_email_unique IF EXISTS');
    await session.run('DROP CONSTRAINT profile_email_exists IF EXISTS');
    await session.run('DROP CONSTRAINT profile_id_exists IF EXISTS');
    await session.run('DROP CONSTRAINT profile_name_exists IF EXISTS');
    await session.run('DROP CONSTRAINT profile_password_exists IF EXISTS');
    session.close();
  },
};