import { v4 } from "uuid"
import { QueryParams, Relation } from "./interfase";
import neo4j from "../neo4jDriver";
import { QueryResult } from "neo4j-driver";
import { RELATION_DIRECTION } from "../constants/constants";

interface PersonData {
  name: string,
  lastName: string,
  id: string,
  relation: Relation
}

class Person {

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

  async fetch(id: string): Promise<any> {
    console.log('Fetch single Person', id)
    return;
  }

  async add(data: Partial<PersonData>): Promise<PersonData> {
    const id: string = v4()
    const {name, lastName = '', relation } = data;
    const tx = neo4j.session!.beginTransaction();
    const createQuery = await tx!.run(`CREATE ( n:Person {id: $id, name: $name, lastName: $lastName } ) RETURN n`,
      {id, name, lastName: lastName });
    const newPerson = createQuery.records[0].get('n').properties as PersonData;

    if (relation) {
      const { id: bId, type: relType, direction, description: relDescription = '' }  =relation
      const relKey = relType.toUpperCase();
      let relQuery = `MATCH (a:Person { id: $aId }) , (b:Person { id: $bId })`;
      switch (direction) {
        case RELATION_DIRECTION.IN:
          relQuery = `${relQuery} CREATE (a)<-[r:${relKey} {description: $relDescription}]-(b) RETURN r`;
          break
        case RELATION_DIRECTION.OUT:
          relQuery = `${relQuery} CREATE (a)-[r:${relKey} {description: $relDescription}]->(b) RETURN r`
          break
        case RELATION_DIRECTION.TWO_WAY:
          relQuery = `${relQuery} CREATE (a)-[r:${relKey} {description: $relDescription}]->(b) `;
          relQuery = `${relQuery} CREATE (a)<-[r_in:${relKey} {description: $relDescription}]-(b) RETURN r`;
          break
        default:
          throw new Error('Relation Direction missing')
      }
      const relationQuery = await tx!.run(relQuery, { aId: id, bId, relDescription})
      newPerson.relation = relationQuery.records[0].get('r').properties
    }
    await tx.commit();
    return newPerson;
  }

  async delete(id: string): Promise<QueryResult> {
    console.log('DELETE SERVICE', id)
    return neo4j.session!.run(`MATCH (n:Person { id: $id }) DETACH DELETE n`, {id});
  }

  deleteRelation(id: number, relation: any) {
    console.log('DELETE ID', id)
    console.log('DELETE RELATION', relation)
    return 'DELETE RELATION'
  }
}

export default new Person();