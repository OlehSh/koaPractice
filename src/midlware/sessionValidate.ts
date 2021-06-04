import { Context, Next } from "koa";
import Session, { SessionInfo } from "../service/Session";
import { container } from "tsyringe";
import { UserTokenDecoded } from "../helpers/jwtHelper";

const sessionService = container.resolve(Session)

export const validateSession = async (ctx: Context, next: Next): Promise<void> => {
  const token: string | undefined = ctx.header.authorization;
  const user: UserTokenDecoded = ctx.state.user as UserTokenDecoded;
  const sessions: SessionInfo[] | null = await sessionService.find({userId: user.id});
  if (!sessions) {
    await next()
    return
  }
  const session =  sessions.find(s => s.token === token)
  ctx.assert(!session, 401, 'Token invalid, reason - deleted')
  await next()
}