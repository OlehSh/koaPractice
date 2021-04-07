import router from "koa-joi-router";
import Profile, { ProfileData } from "../../service/Profile";
import { CONTENT_TYPE } from "../../constants/constants";

import { profileSignupBody } from "../../validate/profile"
import { loginBody } from "../../validate/auth";
import { createToken } from "../../helpers/jwtHelper";
import bcrypt from "bcrypt"
import env from "../../env";


const auth = router();
auth.prefix('/auth/')
auth.post('/login',
  {validate: { type: CONTENT_TYPE.JSON, body: loginBody } },
  async (ctx) => {
    const { email, password }: { email: string, password: string } = ctx.request.body;
    const profile: ProfileData | null = await Profile.fetchAuth({email });
    console.log('Profile', profile);
    ctx.assert(profile, 404, 'Profile not found')
    const compare = await bcrypt.compare(password, profile!.password)
    ctx.assert(compare, 401, 'Incorrect password')
    const { name, id } = profile!
    const token = createToken({id, name, email});
    ctx.body = {token}
  })

auth.post('/signup', { validate: { type: CONTENT_TYPE.JSON, body: profileSignupBody }}, async (ctx) => {
  const profileInfo: Partial<ProfileData> = ctx.request.body
  const password = await bcrypt.hash(profileInfo.password, env.saltRounds)
  const { name, email, id } = await Profile.add({...profileInfo, password})
  ctx.body =  { name, email, id } ;
})

export default auth;