import koaPassport from "koa-passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import Profile, { ProfileData } from "./service/Profile";
import env from "./env";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.secretKey,
}

export default function initStrategy(): void {
  koaPassport.use('jwt', new JwtStrategy(opts, (payload: ProfileData, done) => {
    Profile.fetch(payload.id)
      .then(user => {
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
      .catch(e => {
        return done(e)
      })
  }));
}