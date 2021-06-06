import { v4 } from "uuid"
import { injectable } from "tsyringe";
import { QueryParams } from "./interfase";
import Neo4jDriver from "../neo4jDriver";
import { QueryResult, Session, Transaction } from "neo4j-driver";

export interface ProfileInfo {
  name: string,
  email: string,
  id: string
}

export interface ProfileData extends ProfileInfo {
  password: string
}
@injectable()
export default class Profile {
  constructor(private neo4j: Neo4jDriver) {}
  async fetchAll(queryParams: QueryParams = {}): Promise<QueryResult> {
    const session: Session = await this.neo4j.getSession()
    const { limit, orderBy } = queryParams;
    let query = `MATCH (n:Person) Return n`;
    if (orderBy) {
      query = `${query} ORDER BY n.${orderBy}`
    }
    if (limit) {
      query = `${query} LIMIT ${limit}`
    }
    return session.run(query)
  }

  async fetch(id: string): Promise<ProfileInfo> {
    const session: Session = await this.neo4j.getSession()
    const tx: Transaction = session.beginTransaction();
    try {
      const queryResult = await tx.run('MATCH (n:Profile { id: $id }) RETURN n', {id})
      await tx.commit()
      return queryResult.records[0].get('n').properties as ProfileInfo
    } catch (e) {
      if (tx.isOpen()) {
        await tx.rollback()
      }
      throw e
    }
  }

  async fetchAuth(params: { email: string }): Promise<ProfileData | null> {
    const session: Session = await this.neo4j.getSession()
    const tx: Transaction = session.beginTransaction();
    try {
      const { email } = params;
      const result: QueryResult = await tx.run(`MATCH (n:Profile { email: $email}) RETURN n LIMIT 1`, {email})
      if (!result.records[0]) {
        await tx.commit()
        return null;
      }
      await tx.commit()
      return result.records[0].get('n').properties as ProfileData;
    } catch (e) {
      if (tx.isOpen()) {
        await tx.rollback()
      }
      throw e
    }
  }
  async add(data: Partial<ProfileData>): Promise<ProfileData> {
    const session: Session = await this.neo4j.getSession()
    const tx: Transaction = session.beginTransaction();
    try {
      const id: string = v4()
      const { name, email, password } = data
      const queryResult = await tx.run(
        `CREATE ( n:Profile {id: $id, name: $name, email: $email, password: $password } ) RETURN n`,
        {id, name, email, password})
      await tx.commit()
      return queryResult.records[0].get('n').properties as ProfileData;
    } catch (e) {
      if (tx.isOpen()) {
        await tx.rollback()
      }
      console.log(e.message)
      throw e
    }

  }

  async delete(id: string): Promise<QueryResult> {
    const session: Session = await this.neo4j.getSession()
    const tx: Transaction = session.beginTransaction();
    try {
      const result =  await tx.run(`MATCH (n:Profile { id: $id }) DETACH DELETE n`, {id});
      await tx.commit()
      return result
    } catch (e) {
      if (tx.isOpen()) {
        await tx.rollback()
      }
      throw e
    }
  }

  deleteRelation(id: number, relation: any) {
    console.log('DELETE ID', id)
    console.log('DELETE RELATION', relation)
    return 'DELETE RELATION'
  }
}