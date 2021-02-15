import jwt from "jsonwebtoken";
import env from "../env";
import { ProfileData } from "../service/interfase";

export const createToken = (payload: Partial<ProfileData>) => {
  return jwt.sign(payload, env.secretKey)
}