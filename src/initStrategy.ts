import koaPassport from "koa-passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local"
import Profile from "./service/Profile";
import env from "./env";
import { ProfileData } from "./service/interfase";


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.secretKey,
}

export default function initStrategy(): void {
  koaPassport.use('jwt', new JwtStrategy(opts, (payload: ProfileData, done) => {
    Profile.fetch(payload.id)
      .then(user => {
        console.log('USER', user)
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
      .catch(e => {
        console.log('ERRR', e)
        return done(e)
      })
  }));
}