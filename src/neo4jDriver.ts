import neo4j, { Session, Driver } from 'neo4j-driver';
import env from "./env";

class Neo4jDriver {
  driver?: Driver;
  session?: Session;

  init():Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.driver = neo4j.driver(`bolt://${env.neo4j.host}:${env.neo4j.port}`, neo4j.auth.basic(env.neo4j.user, env.neo4j.password));
        this.session = this.driver.session({database: env.neo4j.dbName});
        console.log('Neo4g session initiated', { database: env.neo4j.dbName, port: env.neo4j.port })
        resolve()
      } catch (e) {
        console.error('Neo4g connection Error', e)
        reject(e)
      }
    })
  }
}

export default new Neo4jDriver()