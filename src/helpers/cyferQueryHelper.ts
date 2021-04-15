import { RELATION_DIRECTION } from "../constants/constants";
import { LABEL, QueryParams } from "../service/interfase";

interface RelationParams {
  type: string,
  direction: RELATION_DIRECTION,
  props?: {[key: string]: any}
}
interface NodeParams {
  label: LABEL,
  id: string
}

const REPLACE_JSON_KEY_QUOTES_REGEXP = /"([^"]+)":/mg

export const getRelationByNodesIdQuery = (firstNodeLabel: LABEL, secondNodeLabel: LABEL, relationParams: RelationParams): string => {
  const {type, direction, props } = relationParams
  const relKey = type.toUpperCase();
  let query = `MATCH (n:${firstNodeLabel} { id: $nId }) , (m:${secondNodeLabel} { id: $mId })`;
  let relProps = '';
  if (props) {
    relProps = JSON.stringify(props).replace(REPLACE_JSON_KEY_QUOTES_REGEXP, '$1:');
  }
  switch (direction) {
    case RELATION_DIRECTION.IN:
      query = `${query} CREATE (n)<-[r:${relKey} ${relProps}]-(m) RETURN r`;
      break
    case RELATION_DIRECTION.OUT:
      query = `${query} CREATE (n)-[r:${relKey} ${relProps}]->(m) RETURN r`
      break
    case RELATION_DIRECTION.TWO_WAY:
      query = `${query} CREATE (n)-[r:${relKey} ${relProps}]->(m) `;
      query = `${query} CREATE (n)<-[r_in:${relKey} ${relProps}]-(m) RETURN r`;
      break
    default:
      throw new Error('Relation Direction missing')
  }
  return query;
}

export const updateNodeByIdQuery = (label: LABEL, params: {[key: string]: any}): string => {
  let query = `MATCH (n:${label} { id: $id})`
  if (params) {
    query = `${query} SET n += ${JSON.stringify(params).replace(REPLACE_JSON_KEY_QUOTES_REGEXP, '$1:')}`;
  }
  query = `${query} RETURN n`
  return query
}

export const deleteRelationByNodesIdQuery = (firstNodeLabel: LABEL,  secondNodeLabel: LABEL, relationParams: RelationParams) => {
  const {direction, type } = relationParams
  const relKey = type.toUpperCase()
  let query = `MATCH (n:${firstNodeLabel} {id: $id})`
  switch (direction) {
    case RELATION_DIRECTION.IN:
      query = `${query}<-[r:${relKey}]-(m:${secondNodeLabel} {id: $id}) DELETE r`;
      break
    case RELATION_DIRECTION.OUT:
      query = `${query}-[r:${relKey}]->(m:${secondNodeLabel} {id: $id}) DELETE r`
      break
    case RELATION_DIRECTION.TWO_WAY:
      query = `${query}-[r:${relKey}]->(m:${secondNodeLabel} {id: $id}),`;
      query = `${query}<-[r_in:${relKey}]-(m:${secondNodeLabel} {id: $id}) DELETE r, r_in`;
      break
    default:
      throw new Error('Relation Direction missing')
  }
  return query;
}