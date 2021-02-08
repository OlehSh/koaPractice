import router from "koa-joi-router";

const user = router();

user.get('/user/', (ctx) => {
  ctx.body = 'login return auth token'
})

user.get('/auth/logout', (ctx) => {
  ctx.body = 'get person by id'
})

user.post('/auth/sighup', (ctx) => {
  ctx.body = 'add new persons'
})

export default user;