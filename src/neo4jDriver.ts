import neo4j, { Session, Driver } from 'neo4j-driver';
import env from "./env";

export default class Neo4jDriver {
  driver?: Driver;
  session?: Session;

  init():Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.driver = neo4j.driver(`bolt://${env.neo4j.host}:${env.neo4j.port}`, neo4j.auth.basic(env.neo4j.user, env.neo4j.password));
        this.session = this.driver.session({database: env.neo4j.dbName});

        this.driver.verifyConnectivity()
          .then(data => {
            console.log('Neo4j session info', {database: env.neo4j.dbName, ...data})
            return resolve()
          })
          .catch(e => reject(e))
      } catch (e) {
        console.error('Neo4j connection Error', e)
        return reject(e)
      }
    })
  }
}

// export default new Neo4jDriver()