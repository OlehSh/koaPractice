import { Joi } from "koa-joi-router";

const loginBody = {
  email: Joi.string().email().required(),
  password: Joi.string().required()
}

export {
  loginBody
}