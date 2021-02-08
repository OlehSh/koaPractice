import koaPassport from "koa-passport";
import JwtStrategy from "passport-jwt"



koaPassport.serializeUser((user, done) => {
  done(null, user.id)
});

koaPassport.deserializeUser(async (id, done) => {
  try {
    const user = await fetchUser();
    done(null, user);
  } catch(err) {
    done(err);
  }
});

koaPassport.use(new JwtStrategy((username, password, done) => {
  fetchUser()
    .then(user => {
      if (username === user.username && password === user.password) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch((err) => { done(err) });
}));