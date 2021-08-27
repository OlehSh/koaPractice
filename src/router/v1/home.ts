import router from "koa-joi-router";
import {Context} from "koa";

const home = router();

home.get('/', (ctx: Context) => {
  ctx.body = 'HOME PAGE'
})

export default home;