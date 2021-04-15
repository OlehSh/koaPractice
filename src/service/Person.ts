import { v4 } from "uuid"
import { injectable } from "tsyringe";
import { LABEL, QueryParams, Relation } from "./interfase";
import Neo4jDriver from "../neo4jDriver";
import { QueryResult } from "neo4j-driver";
import { deleteRelationByNodesIdQuery, getRelationByNodesIdQuery, updateNodeByIdQuery } from "../helpers/cyferQueryHelper";
import { RELATION_DIRECTION } from "../constants/constants";

interface PersonData {
  name: string,
  lastName: string,
  id: string,
  relation: Relation
}
@injectable()
export default class Person {

  constructor(private neo4j: Neo4jDriver) {}

  async fetchAll(queryParams: QueryParams = {}): Promise<QueryResult> {
    const { limit, orderBy } = queryParams;
    let query = `MATCH (n:${LABEL.PERSON}) Return n`;
    if (orderBy) {
      query = `${query} ORDER BY n.${orderBy}`
    }
    if (limit) {
      query = `${query} LIMIT ${limit}`
    }
    return this.neo4j.session.run(query)
  }

  async fetch(id: string): Promise<PersonData | null> {
    const queryResult = await this.neo4j.session.run(`MATCH( n:${LABEL.PERSON} { id: $id }) RETURN n`, {id})
    if (!queryResult || !queryResult.records[0]) {
      return null;
    }
    return queryResult.records[0].get('n').properties as PersonData;
  }

  async add(data: Partial<PersonData>): Promise<PersonData> {
    const id: string = v4()
    const {name, lastName = '', relation } = data;
    try {
      const tx = this.neo4j.session.beginTransaction();
      const createQuery: QueryResult  = await tx.run(`CREATE ( n:${LABEL.PERSON} {id: $id, name: $name, lastName: $lastName } ) RETURN n`,
        {id, name, lastName: lastName });
      if (!createQuery.records || !createQuery.records.length) {
        await tx.rollback()
        throw new Error ('QueryResult records missing')
      }
      const newPerson = createQuery.records[0].get('n').properties as PersonData;

      if (relation) {
        const {id: mId, type: relType, direction, description: relDescription = ''} = relation
        const relQuery = getRelationByNodesIdQuery(LABEL.PERSON, LABEL.PERSON, {
          type: relType,
          direction,
          props: {description: relDescription}
        })
        const relationQuery = await tx.run(relQuery, {nId: id, mId, relDescription})
        newPerson.relation = relationQuery.records[0].get('r').properties as Relation
      }
      await tx.commit();
      return newPerson;
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async update(id: string, data: Partial<PersonData> ): Promise<PersonData> {
    const {relation, ...props } = data
    const query = updateNodeByIdQuery(LABEL.PERSON, props)
    const tx = this.neo4j.session.beginTransaction();
    try {
      const queryResult: QueryResult = await tx.run(query, {id})
      if (!queryResult.records || queryResult.records.length ) {
        throw new Error('Data For update is missing')
      }
      const person = queryResult.records[0].get('n').properties as PersonData
      if(relation) {
        const { id: relId, type, direction, description } = relation;
        const relQuery = getRelationByNodesIdQuery(LABEL.PERSON, LABEL.PERSON, {type, direction , props: {description}});
        const relResult: QueryResult = await tx.run(relQuery, { nId: id, mId: relId})
        person.relation = relResult.records[0].toObject() as Relation
      }
      await tx.commit();
      return person
    } catch (e) {
      await tx.rollback();
      throw e;
    }

  }

  async delete(id: string): Promise<QueryResult> {
    return this.neo4j.session.run(`MATCH (n:${LABEL.PERSON} { id: $id }) DETACH DELETE n`, {id});
  }

  async deleteRelation(id: string, relation: {id: string, nodeLabel: LABEL, relLabel: string, direction: RELATION_DIRECTION}) {
    const { id: relNodeId, nodeLabel, direction, relLabel } = relation;
    const queryString = deleteRelationByNodesIdQuery(LABEL.PERSON, nodeLabel, {direction, type: relLabel})
    return this.neo4j.session.run(queryString, {id, relNodeId})
  }
}