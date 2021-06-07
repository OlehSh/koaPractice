import { RELATION_DIRECTION } from "../constants/constants";

export enum NODE {
  PROFILE = 'Profile',
  PERSON = 'Person',
  TOKEN = 'Token'
}

export enum RELATION {
  SESSION = 'Session',
  SPOUSE = "SPOUSE",
  CHILD = "CHILD"
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