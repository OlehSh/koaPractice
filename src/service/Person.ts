import { v4 } from "uuid"
import { LABEL, QueryParams, Relation } from "./interfase";
import neo4j from "../neo4jDriver";
import { QueryResult } from "neo4j-driver";
import { createRelationQuery, createUpdateQuery } from "../helpers/cyferQueryHelper";

interface PersonData {
  name: string,
  lastName: string,
  id: string,
  relation: Relation | any
}

class Person {

  async fetchAll(queryParams: QueryParams = {}): Promise<QueryResult> {
    const { limit, orderBy } = queryParams;
    let query = `MATCH (n:${LABEL.PERSON}) Return n`;
    if (orderBy) {
      query = `${query} ORDER BY n.${orderBy}`
    }
    if (limit) {
      query = `${query} LIMIT ${limit}`
    }
    return neo4j.session!.run(query)
  }

  async fetch(id: string): Promise<PersonData | null> {
    console.log('Fetch single Person', id)
    const queryResult = await neo4j.session!.run(`MATCH( n:${LABEL.PERSON} { id: $id }) RETURN n`, {id})
    if (!queryResult.records[0]) {
      return null;
    }
    return queryResult.records[0].get('n').properties as PersonData;
  }

  async add(data: Partial<PersonData>): Promise<PersonData> {
    const id: string = v4()
    const {name, lastName = '', relation } = data;
    const tx = neo4j.session!.beginTransaction();
    const createQuery = await tx.run(`CREATE ( n:${LABEL.PERSON} {id: $id, name: $name, lastName: $lastName } ) RETURN n`,
      {id, name, lastName: lastName });
    const newPerson = createQuery.records[0].get('n').properties as PersonData;

    if (relation) {
      const { id: mId, type: relType, direction, description: relDescription = '' }  =relation
      const relQuery = createRelationQuery(LABEL.PERSON, LABEL.PERSON, {type: relType, direction, props: {description: relDescription}})
      const relationQuery = await tx.run(relQuery, { nId: id, mId, relDescription})
      newPerson.relation = relationQuery.records[0].get('r').properties
    }
    await tx.commit();
    return newPerson;
  }

  async update(id: string, data: Partial<PersonData> ): Promise<PersonData> {
    const {relation, ...props } = data
    const query = createUpdateQuery(LABEL.PERSON, props)
    const tx = neo4j.session!.beginTransaction();
    const queryResult = await tx.run(query, {id})
    const person = queryResult.records[0].get('n').properties as PersonData
    if(relation) {
      const { id: relId, type, direction, description } = relation;
      const relQuery = createRelationQuery(LABEL.PERSON, LABEL.PERSON, {type, direction , props: {description}});
      console.log('ID', id)
      console.log('relId', relId)
      const relResult = await tx.run(relQuery, { nId: id, mId: relId})
      person.relation = relResult.records[0].toObject()
    }
    await tx.commit();
    return person
  }

  async delete(id: string): Promise<QueryResult> {
    console.log('DELETE SERVICE', id)
    return neo4j.session!.run(`MATCH (n:${LABEL.PERSON} { id: $id }) DETACH DELETE n`, {id});
  }

  deleteRelation(id: number, relation: any) {
    console.log('DELETE ID', id)
    console.log('DELETE RELATION', relation)
    return 'DELETE RELATION'
  }
}

export default new Person();