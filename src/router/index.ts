import router from "koa-joi-router";
import v1 from "./v1";

const api = router();

api.use(v1.middleware())

export default api;