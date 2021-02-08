import router from "koa-joi-router";
import koaPassport from "koa-passport";
import Profile from "../../service/Profile";
import { PROFILE_TYPE } from "../../constants/constants";
import ProfileData from "../../service/interfase";

const auth = router();

auth.post('/auth/login', (ctx) => {
  console.log('LOGIN ===>', ctx.request)
  koaPassport.authenticate('local', (err, user, info, status) => {
    console.log('11111', err)
    console.log('222222', user)
    console.log('333333', info)
    console.log('444444', status)
  })
  // ctx.body = 'login return auth token'
})

auth.post('/auth/logout', (ctx) => {
  ctx.logout()
  ctx.body = 'get person by id'
})

auth.post('/auth/sighup', async (ctx) => {
  ctx.body = 'add new profile'
  const profileInfo: Partial<ProfileData> = ctx.request.body
  await Profile.add({ type: PROFILE_TYPE.ADMIN, ...profileInfo})
})

export default auth;