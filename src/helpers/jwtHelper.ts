import jwt from "jsonwebtoken";
import env from "../env";
import { ProfileInfo } from "../service/Profile";

export interface UserTokenDecoded {
  id: string,
  name: string,
  email: string,
  iat: number,
  exp: number
}

export const createToken = (payload: Partial<ProfileInfo>) => {
  return jwt.sign(payload, env.secretKey, { expiresIn: "60000"})
}

export const decodeToken = (payload: string) => {
  return jwt.decode(payload.replace(/Bearer /i, ''))
}