const {neo4j, nodes} = require('../constants')

module.exports = {
  name: 'Clear Test DB',
  forward: async (driver) => {
    const session = driver.session({
      database: neo4j.dbName
    });
    const tx = session.beginTransaction()
    await Promise.all(nodes.map(node => tx.run(`MATCH (n:${node}) DETACH DELETE n`)))
    await tx.commit();
    session.close();
  },
  // eslint-disable-next-line no-unused-vars
  backward: async (driver) => {},
};