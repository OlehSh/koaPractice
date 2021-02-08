import  router from "koa-joi-router";
import home from "./home";
import auth from "./auth";
import person from "./person";

const api = router();

api.prefix('/v1/')

api.use(home.middleware())
api.use(auth.middleware())
api.use(person.middleware())

export default api;