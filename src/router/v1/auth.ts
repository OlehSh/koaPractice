import router from "koa-joi-router";
import { container } from "tsyringe";
import Profile, { ProfileData } from "../../service/Profile";
import Session   from "../../service/Session";
import { CONTENT_TYPE } from "../../constants/constants";
import { profileSignupBody } from "../../validate/profile"
import { loginBody } from "../../validate/auth";
import { createToken, UserTokenDecoded } from "../../helpers/jwtHelper";
import bcrypt from "bcrypt"
import env from "../../env";
import koaPassport from "koa-passport";
import { validateSession } from "../../midlware/sessionValidate";


const auth = router();
const profileService = container.resolve(Profile)
const sessionService = container.resolve(Session)

interface ProfileBody extends ProfileData {
  repeatPassword: string
}

interface LoginBody {
  email: string,
  password: string
}

auth.prefix('/auth/')

auth.post('/login',
  {validate: {type: CONTENT_TYPE.JSON, body: loginBody}},
  async (ctx) => {
    const {email, password} = ctx.request.body as LoginBody;
    const profile: ProfileData | null = await profileService.fetchAuth({email});
    ctx.assert(profile, 404, 'Profile not found')
    const compare = await bcrypt.compare(password, profile!.password)
    ctx.assert(compare, 401, 'Incorrect password')
    const {name, id} = profile!
    const token = createToken({id, name, email});
    ctx.body = {token}
  })

auth.post('/signup',
  {validate: {type: CONTENT_TYPE.JSON, body: profileSignupBody}},
  async (ctx) => {
    // TODO check if user exists to handle error
    const profileInfo: ProfileBody = ctx.request.body as ProfileBody
    const password = await bcrypt.hash(profileInfo.password, env.saltRounds)
    const {name, email, id} = await profileService.add({...profileInfo, password})
    ctx.body = {name, email, id};

  })

auth.post('/logout',
  koaPassport.authenticate('jwt', {session: false}),
  validateSession,
  async (ctx) => {
    const token: string = ctx.header.authorization as string
    const user: UserTokenDecoded = ctx.state.user as UserTokenDecoded
    await sessionService.add(token, user.id)
    ctx.body = {message: "logged out"};
  })

export default auth;