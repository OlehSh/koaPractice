import { v4 } from "uuid"
import { QueryParams } from "./interfase";
import neo4j from "../neo4jDriver";
import { QueryResult } from "neo4j-driver";

interface ProfileInfo {
  name: string,
  email: string,
  id: string
}

export interface ProfileData extends ProfileInfo {
  password: string
}

class Profile {

  async fetchAll(queryParams: QueryParams = {}): Promise<QueryResult> {
    const { limit, orderBy } = queryParams;
    let query = `MATCH (n:Person) Return n`;
    if (orderBy) {
      query = `${query} ORDER BY n.${orderBy}`
    }
    if (limit) {
      query = `${query} LIMIT ${limit}`
    }
    return neo4j.session!.run(query)
  }

  async fetch(id: string): Promise<ProfileInfo> {
    console.log('Fetch single profile', id)
    const queryResult = await neo4j.session!.run(`MATCH (n:Profile { id: $id }) RETURN n.name, n.email, n.id`, {id})
    const profile = queryResult.records[0] ? queryResult.records[0] : {}
    return profile as ProfileInfo

  }
  async fetchAuth(params: { email: string }): Promise<ProfileData | null> {
    const { email } = params;
    const result: QueryResult = await neo4j.session!.run(`MATCH (n:Profile { email: $email}) RETURN n LIMIT 1`, {email})
    if (!result.records[0]) {
      return null;
    }
    const profile = result.records[0].get('n').properties;
    return profile as ProfileData;
  }
  async add(data: Partial<ProfileData>): Promise<ProfileData> {
    const id: string = v4()
    const { name, email, password } = data
    const queryResult = await neo4j.session!.run(
      `CREATE ( n:Profile {id: $id, name: $name, email: $email, password: $password } ) RETURN n`,
      {id, name, email, password})
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return queryResult.records[0].get('n').properties as ProfileData;
  }

  async delete(id: string): Promise<QueryResult> {
    console.log('DELETE SERVICE', id)
    return neo4j.session!.run(`MATCH (n:Profile { id: $id }) DETACH DELETE n`, {id});
  }

  deleteRelation(id: number, relation: any) {
    console.log('DELETE ID', id)
    console.log('DELETE RELATION', relation)
    return 'DELETE RELATION'
  }
}

export default new Profile();