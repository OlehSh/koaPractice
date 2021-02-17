import { RELATION_DIRECTION } from "../constants/constants";

export enum LABEL {
  PROFILE = 'Profile',
  PERSON = 'Person'
}
export interface QueryParams {
  limit?: number,
  orderBy?: string,
  filter?: {[key: string]: any}
}

export interface Relation {
  id: string,
  type: string,
  direction: RELATION_DIRECTION,
  description?: string
}