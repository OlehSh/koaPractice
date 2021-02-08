import { PROFILE_TYPE } from "../constants/constants";

export default interface ProfileData {
  name: string,
  email: string,
  password: string,
  id: string,
  type: PROFILE_TYPE
}