import { Context, Next } from "koa";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function (ctx: Context, next: Next) {
  if(ctx.isAuthenticated()) {
    await next()
  } else  {
    ctx.body = "access denied";
    ctx.status = 401;
  }
}