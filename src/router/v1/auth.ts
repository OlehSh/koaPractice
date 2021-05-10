import router from "koa-joi-router";
import {container} from "tsyringe";
// import Profile, { ProfileData } from "../../service/Profile";
import { CONTENT_TYPE } from "../../constants/constants";
import { profileSignupBody } from "../../validate/profile"
import { loginBody } from "../../validate/auth";
import { createToken } from "../../helpers/jwtHelper";
import bcrypt from "bcrypt"
import env from "../../env";


const auth = router();
// const profileService = container.resolve(Profile)
auth.prefix('/auth/')
auth.post('/login',
  {validate: { type: CONTENT_TYPE.JSON, body: loginBody } },
  (ctx) => {
    // const { email, password }: { email: string, password: string } = ctx.request.body;
    // const profile: ProfileData | null = await profileService.fetchAuth({email });
    // ctx.assert(profile, 404, 'Profile not found')
    // const compare = await bcrypt.compare(password, profile!.password)
    // ctx.assert(compare, 401, 'Incorrect password')
    // const { name, id } = profile!
    // const token = createToken({id, name, email});
    // ctx.body = {token}
    ctx.body = "success"
  })

auth.post('/signup', { validate: { type: CONTENT_TYPE.JSON, body: profileSignupBody }}, (ctx) => {
  // const profileInfo: Partial<ProfileData> = ctx.request.body
  // const password = await bcrypt.hash(profileInfo.password, env.saltRounds)
  // const { name, email, id } = await profileService.add({...profileInfo, password})
  // ctx.body =  { name, email, id } ;
  ctx.body = "success"
})

export default auth;