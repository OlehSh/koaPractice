import router from "koa-joi-router";
import { container } from "tsyringe";
import Profile from "../../service/Profile";
import koaPassport from "koa-passport";
import { QueryResult } from "neo4j-driver";
import { UserTokenDecoded } from "../../helpers/jwtHelper";
import { validateSession } from "../../midlware/sessionValidate";
import {Context} from "koa";

const profile = router();
const profileService = container.resolve(Profile)

profile.prefix('/profile/')

profile.get(
  '/', 
  koaPassport.authenticate('jwt', {session: false}),
  validateSession,
  (ctx: Context) => {
    ctx.body = 'get profile data'
  })

profile.post(
  '/',
  koaPassport.authenticate('jwt', {session: false}),
  validateSession,
  (ctx) => {
    ctx.body = 'update profile data'
  })

profile.delete(
  '/',
  koaPassport.authenticate('jwt', {session: false}),
  validateSession,
  async (ctx: Context) => {
    try {
      const user: UserTokenDecoded = ctx.state.user as UserTokenDecoded
      const result: QueryResult = await profileService.delete(user.id);
      ctx.assert(result.summary.counters.updates().nodesDeleted !== 0, 404, 'Profile not found')
      ctx.body = 'success'
    } catch (e: any) {
      ctx.throw('Delete Profile error')
    }
  })

profile.delete(
  '/:id',
  koaPassport.authenticate('jwt', {session: false}),
  validateSession,
  async (ctx: Context) => {
    const result: QueryResult = await profileService.delete(ctx.params.id);
    ctx.assert(result.summary.counters.updates().nodesDeleted !== 0, 404, 'Profile not found')
    ctx.body = 'success'

  })

export default profile;