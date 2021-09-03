import { RELATION_DIRECTION } from "../constants/constants";

export enum NODE_LABEL {
  PROFILE = 'Profile',
  PERSON = 'Person',
  TOKEN = 'Token',
  WORLD='World'
}

export enum RELATION_LABEL {
  SESSION = 'Session',
  SPOUSE = "Spouse",
  CHILD = "Child",
  CHARACTER = "Character",
  HALF_SIBLING = "HalfSibling"
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