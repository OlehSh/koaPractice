import router from "koa-joi-router";
import Profile from "../../service/Profile";
import koaPassport from "koa-passport";
import { QueryResult } from "neo4j-driver";

const profile = router();
profile.prefix('/profile/')

profile.get('/', koaPassport.authenticate('jwt', {session: false}), (ctx) => {
  ctx.body = 'get profile data'
})

profile.post('/', (ctx) => {
  ctx.body = 'update profile data'
})

profile.delete('/:id', koaPassport.authenticate('jwt', { session: false }), async (ctx) => {
  const { id }: {id: string} = ctx.params;
  console.log('DELETE', id)
  const result: QueryResult = await Profile.delete(id);
  ctx.assert(result.summary.counters.updates().nodesDeleted !== 0, 404, 'Profile not found')
  ctx.body = 'success'
})


export default profile;