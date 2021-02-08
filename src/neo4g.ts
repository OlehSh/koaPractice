import neo4j, { Session, Driver } from 'neo4j-driver';
import env from "./env";

class Neo4g {
  driver?: Driver;
  session?: Session;

  init() {
    try {
      this.driver = neo4j.driver(`bolt://${env.neo4j.host}:${env.neo4j.port}`, neo4j.auth.basic(env.neo4j.user, env.neo4j.password));
      this.session = this.driver.session({database: env.neo4j.dbName});
      console.log('Neo4g session initiated', { database: env.neo4j.dbName, port: env.neo4j.port })
    } catch (e) {
      console.log('Neo4g connection Error', e)
      throw (e)
    }
  }
}

export default new Neo4g()