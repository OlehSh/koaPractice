import neo4j, { Session, Driver } from 'neo4j-driver';
import env from "./env";
import { singleton } from "tsyringe";
//
@singleton()
export default class Neo4jDriver {
  driver: Driver;
  private session: Session | undefined;

  constructor() {
    try {
      this.driver = neo4j.driver(`bolt://${env.neo4j.host}:${env.neo4j.port}`, neo4j.auth.basic(env.neo4j.user, env.neo4j.password));
      this.driver.verifyConnectivity()
        .then(data => {
          console.log('Neo4j session created', {database: env.neo4j.dbName, ...data})
        })
    } catch (e) {
      console.error('Neo4j connection Error', e)
      throw e
    }
  }

  get getSession() {
    return (async (): Promise<Session> => {
      if (this.session) {
        await this.session.close()
      }
      this.session = this.driver.session({database: env.neo4j.dbName});
      return this.session
    })
  }
}