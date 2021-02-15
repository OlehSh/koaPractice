import { Context, Next } from "koa";

export default async function (ctx: Context, next: Next): Promise<void> {
  if(ctx.isAuthenticated()) {
    await next()
  } else  {
    ctx.body = "access denied";
    ctx.status = 401;
  }
}