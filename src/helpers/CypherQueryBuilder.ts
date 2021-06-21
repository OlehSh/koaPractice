import { RELATION_DIRECTION } from "../constants/constants";


interface QueryParams  {[key: string]: string | number | string[] | number[]}

interface MatchQuery {
  labels: string | string[],
  params: QueryParams
  relation?: {
    label: string,
    params: QueryParams,
    direction: RELATION_DIRECTION
  }
}
export default class CypherQueryBuilder {
  private queryString = '';

  get query(): string {
    return this.queryString
  }

  match(payload: MatchQuery): CypherQueryBuilder {
    // TODO create MATCH query builder
    let query = 'MATCH'
    if (Array.isArray(payload.labels) && payload.relation) {
      for (let i = 0; i < payload.labels.length; i++) {
        query +=`(n[${i}]:${payload.labels[i]})`
      }
      query += ''
    }
    this.queryString = query
    return this
  }

  limit(limit: number): CypherQueryBuilder {
    this.queryString += `LIMIT ${limit}`
    return this
  }

  skip(num: number): CypherQueryBuilder {
    this.queryString += `SKIP ${num}`
    return this
  }

  return(items: string[]): CypherQueryBuilder {
    this.queryString += `SKIP ${items.toString()}`
    return this
  }
}