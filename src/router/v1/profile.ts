import router from "koa-joi-router";
import Profile from "../../service/Profile";
import koaPassport from "koa-passport";

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
  await Profile.delete(id)
  ctx.body = 'success'
})


export default profile;