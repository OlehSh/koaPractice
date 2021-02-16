import { RELATION_DIRECTION } from "../constants/constants";

export interface QueryParams {
  limit?: number,
  orderBy?: string,
}

export interface Relation {
  id: string,
  type: string,
  direction: RELATION_DIRECTION,
  description?: string
}