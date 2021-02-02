import * as router from "koa-joi-router";
import home from "./home";
const api = router();

api.prefix('/v1/');

api.use(home.middleware())

export default api;