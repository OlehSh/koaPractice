import { v4 } from "uuid"
import { injectable } from "tsyringe";
import { NODE_LABEL, QueryParams, Relation } from "./interfase";
import Neo4jDriver from "../neo4jDriver";
import { QueryResult, Record, Session } from "neo4j-driver";
import { deleteRelationByNodesIdQuery, createAddNodeRelationQuery, updateNodeByIdQuery } from "../helpers/cyferQueryHelper";
import { RELATION_DIRECTION } from "../constants/constants";

export interface PersonData {
  name: string,
  lastName: string,
  id: string,
  relation: Relation
}

export interface PersonResponse {
  name: string,
  lastName: string,
  id: string,
  relations: Relation[]
}

@injectable()
export default class Person {

  constructor(private neo4j: Neo4jDriver) {}

  async fetchAll(queryParams: QueryParams = {}): Promise<QueryResult> {
    const session: Session = await this.neo4j.getSession()
    const { limit, orderBy } = queryParams;
    let query = `MATCH (n:${NODE_LABEL.PERSON}) Return n`;
    if (orderBy) {
      query = `${query} ORDER BY n.${orderBy}`
    }
    if (limit) {
      query = `${query} LIMIT ${limit}`
    }
    return session.run(query)
  }

  async fetch(id: string): Promise<PersonResponse | null> {
    const session: Session = await this.neo4j.getSession()
    const queryResult = await session.run(`MATCH( n:${NODE_LABEL.PERSON} { id: $id }) RETURN n`, {id})
    if (!queryResult || !queryResult.records[0]) {
      return null;
    }
    return queryResult.records[0].get('n').properties as PersonResponse;
  }

  async add(data: Partial<PersonData>): Promise<PersonResponse | null> {
    const id: string = v4()
    const {name, lastName = '', relation } = data;
    const session: Session = await this.neo4j.getSession()
    const tx = session.beginTransaction();
    try {
      const createQuery: QueryResult  = await tx.run(`CREATE ( n:${NODE_LABEL.PERSON} {id: $id, name: $name, lastName: $lastName } ) RETURN n`,
        {id, name, lastName: lastName });
      if (!createQuery.records || !createQuery.records.length) {
        await tx.rollback()
        throw Error ('QueryResult records missing')
      }
      const newPerson = createQuery.records[0].get('n').properties as PersonResponse;

      if (relation) {
        const { id: mId, type: relType, direction, description: relDescription = '' } = relation
        const relQuery = createAddNodeRelationQuery(NODE_LABEL.PERSON, NODE_LABEL.PERSON, {
          type: relType,
          direction,
          props: {description: relDescription}
        })
        const relationQuery = await tx.run(relQuery, {nId: id, mId, relDescription})
        if (!relationQuery.records || !relationQuery.records.length) {
          await tx.rollback()
          throw new Error("Relation is not created")
        }
        newPerson.relations = relationQuery.records.map((record) => record.get('r').properties) as Relation[]
      }
      await tx.commit();
      return newPerson;
    } catch (e) {
      if (tx.isOpen()) {
        await tx.rollback()
      }
      throw e
    }
  }

  async update(id: string, data: Partial<PersonData> ): Promise<PersonData> {
    const {relation, ...props } = data
    const query = updateNodeByIdQuery(NODE_LABEL.PERSON, props)
    const session: Session = await this.neo4j.getSession()
    const tx = session.beginTransaction();
    try {
      const queryResult: QueryResult = await tx.run(query, {id})
      if (!queryResult.records || !queryResult.records.length ) {
        throw new Error('Data For update is missing')
      }
      const person = queryResult.records[0].get('n').properties as PersonData
      if(relation) {
        const { id: relId, type, direction, description } = relation;
        const relQuery = createAddNodeRelationQuery(NODE_LABEL.PERSON, NODE_LABEL.PERSON, {type, direction , props: {description}});
        const relResult: QueryResult = await tx.run(relQuery, { nId: id, mId: relId})
        person.relation = relResult.records[0].toObject() as Relation
      }
      await tx.commit();
      return person
    } catch (e) {
      if (tx.isOpen()) {
        await tx.rollback()
      }
      throw e;
    }

  }

  async delete(id: string): Promise<QueryResult> {
    const session: Session = await this.neo4j.getSession()
    return session.run(`MATCH (n:${NODE_LABEL.PERSON} { id: $id }) DETACH DELETE n`, {id});
  }

  async deleteRelation(id: string, relation: {id: string, nodeLabel: NODE_LABEL, relLabel: string, direction: RELATION_DIRECTION}): Promise<QueryResult> {
    const session: Session = await this.neo4j.getSession()
    const { id: relNodeId, nodeLabel, direction, relLabel } = relation;
    const queryString = deleteRelationByNodesIdQuery(NODE_LABEL.PERSON, nodeLabel, {direction, type: relLabel})
    return session.run(queryString, {id, relNodeId})
  }
}