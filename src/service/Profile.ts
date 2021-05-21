import { v4 } from "uuid"
import { injectable } from "tsyringe";
import { QueryParams } from "./interfase";
import Neo4jDriver from "../neo4jDriver";
import { QueryResult } from "neo4j-driver";

interface ProfileInfo {
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
    const { limit, orderBy } = queryParams;
    let query = `MATCH (n:Person) Return n`;
    if (orderBy) {
      query = `${query} ORDER BY n.${orderBy}`
    }
    if (limit) {
      query = `${query} LIMIT ${limit}`
    }
    return this.neo4j.session.run(query)
  }

  async fetch(id: string): Promise<ProfileInfo> {
    console.log('Fetch single profile', id)
    const queryResult = await this.neo4j.session.run(`MATCH (n:Profile { id: $id }) RETURN n.name, n.email, n.id`, {id})
    const profile = queryResult.records[0] ? queryResult.records[0] : {}
    return profile as ProfileInfo

  }
  async fetchAuth(params: { email: string }): Promise<ProfileData | null> {
    const { email } = params;
    const result: QueryResult = await this.neo4j.session.run(`MATCH (n:Profile { email: $email}) RETURN n LIMIT 1`, {email})
    if (!result.records[0]) {
      return null;
    }
    return result.records[0].get('n').properties as ProfileData;
  }
  async add(data: Partial<ProfileData>): Promise<ProfileData> {
    const id: string = v4()
    const { name, email, password } = data
    const queryResult = await this.neo4j.session.run(
      `CREATE ( n:Profile {id: $id, name: $name, email: $email, password: $password } ) RETURN n`,
      {id, name, email, password})
    return queryResult.records[0].get('n').properties as ProfileData;
  }

  async delete(id: string): Promise<QueryResult> {
    console.log('DELETE SERVICE', id)
    return this.neo4j.session.run(`MATCH (n:Profile { id: $id }) DETACH DELETE n`, {id});
  }

  deleteRelation(id: number, relation: any) {
    console.log('DELETE ID', id)
    console.log('DELETE RELATION', relation)
    return 'DELETE RELATION'
  }
}