import { v4 } from "uuid"
import { injectable } from "tsyringe";
import { NODE, RELATION, QueryParams } from "./interfase";
import Neo4jDriver from "../neo4jDriver";
import { Session as Neo4jSession, QueryResult, Transaction, Record } from "neo4j-driver";

enum IS_ACTIVE {
  FALSE,
  TRUE
}

export interface SessionInfo {
  id: string,
  token: string,
  status: IS_ACTIVE
}
@injectable()
export default class Session {
  constructor(private neo4j: Neo4jDriver) {}
  async fetchAll(queryParams: QueryParams = {}): Promise<QueryResult> {
    const cdtSession: Neo4jSession = await this.neo4j.getSession()
    const { limit, orderBy } = queryParams;
    let query = `MATCH (n:Session) Return n`;
    if (orderBy) {
      query = `${query} ORDER BY n.${orderBy}`
    }
    if (limit) {
      query = `${query} LIMIT ${limit}`
    }
    return cdtSession.run(query)
  }

  async fetch(id: string): Promise<SessionInfo> {
    const dbSession: Neo4jSession = await this.neo4j.getSession()
    const queryResult = await dbSession.run('MATCH (n:Session { id: $id }) RETURN n', {id})
    const session = queryResult.records[0] ? queryResult.records[0] : {}
    return session as SessionInfo

  }
  async find(params: { userId: string }): Promise<SessionInfo[] | null> {
    const cdtSession: Neo4jSession = await this.neo4j.getSession()
    const { userId } = params;
    const result: QueryResult = await cdtSession.run(`MATCH( User { id: $userId}) --> (s:Token) RETURN s`, {userId})
    if (!result.records.length) {
      return null;
    }
    return result.records.map((r: Record) => r.get("s").properties) as SessionInfo[];
  }

  switchStatus(status: IS_ACTIVE): IS_ACTIVE {
    return status
  }

  async add(token: string, userId: string): Promise<SessionInfo> {
    const cdtSession: Neo4jSession = await this.neo4j.getSession()
    const tx: Transaction = cdtSession.beginTransaction();
    try {
      const id: string = v4()
      const queryResult = await tx.run(
        `MATCH (u:${NODE.PROFILE} { id: $userId}) CREATE (t:${NODE.TOKEN} {id: $id, token: $token, myVar: 'test', active: $active})<-[r:${RELATION.SESSION}]-(u) RETURN t`,
        {id, token, active: IS_ACTIVE.FALSE, userId})
      await tx.commit()
      return queryResult.records[0].get('t').properties as SessionInfo;
    } catch (e){
      if (tx.isOpen()) {
        await tx.rollback()
      }
      throw e
    }

  }

  async delete(id: string): Promise<QueryResult> {
    const cdtSession: Neo4jSession = await this.neo4j.getSession()
    return cdtSession.run(`MATCH (n:Profile { id: $id }) DETACH DELETE n`, {id});
  }

}