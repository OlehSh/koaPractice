import { v4 } from "uuid"
import { container } from "tsyringe";
import { LABEL, QueryParams, Relation } from "./interfase";
import Neo4jDriver from "../neo4jDriver";
import { QueryResult } from "neo4j-driver";
import { deleteRelationByNodesIdQuery, relationByNodesIdQuery, updateNodeByIdQuery } from "../helpers/cyferQueryHelper";
import { RELATION_DIRECTION } from "../constants/constants";

const neo4j = container.resolve(Neo4jDriver)

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
      const relQuery = relationByNodesIdQuery(LABEL.PERSON, LABEL.PERSON, {type: relType, direction, props: {description: relDescription}})
      const relationQuery = await tx.run(relQuery, { nId: id, mId, relDescription})
      newPerson.relation = relationQuery.records[0].get('r').properties
    }
    await tx.commit();
    return newPerson;
  }

  async update(id: string, data: Partial<PersonData> ): Promise<PersonData> {
    const {relation, ...props } = data
    const query = updateNodeByIdQuery(LABEL.PERSON, props)
    const tx = neo4j.session!.beginTransaction();
    try {
      const queryResult = await tx.run(query, {id})
      const person = queryResult.records[0].get('n').properties as PersonData
      if(relation) {
        const { id: relId, type, direction, description } = relation;
        const relQuery = relationByNodesIdQuery(LABEL.PERSON, LABEL.PERSON, {type, direction , props: {description}});
        const relResult = await tx.run(relQuery, { nId: id, mId: relId})
        person.relation = relResult.records[0].toObject()
      }
      await tx.commit();
      return person
    } catch (e) {
      await tx.rollback();
      throw e;
    }

  }

  async delete(id: string): Promise<QueryResult> {
    return neo4j.session!.run(`MATCH (n:${LABEL.PERSON} { id: $id }) DETACH DELETE n`, {id});
  }

  async deleteRelation(id: string, relation: {id: string, nodeLabel: LABEL, relLabel: string, direction: RELATION_DIRECTION}) {
    const { id: relNodeId, nodeLabel, direction, relLabel } = relation;
    const queryString = deleteRelationByNodesIdQuery(LABEL.PERSON, nodeLabel, {direction, type: relLabel})
    return neo4j.session!.run(queryString, {id, relNodeId})
  }
}

export default new Person();