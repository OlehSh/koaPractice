import router from "koa-joi-router";

const home = router();

home.get('/', (ctx) => {
  ctx.body = 'HOME PAGE'
})

export default home;