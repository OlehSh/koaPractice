import { Joi } from "koa-joi-router";

const loginBody = {
  email: Joi.string(),
  password: Joi.string()
}

export {
  loginBody
}