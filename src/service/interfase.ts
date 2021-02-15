import { PROFILE_TYPE } from "../constants/constants";

export interface ProfileData {
  name: string,
  email: string,
  password: string,
  id: string,
}

export interface QueryParams {
  limit?: number,
  orderBy?: string,
}