import { Joi } from "koa-joi-router";

const loginBody = {
  email: Joi.string().required(),
  password: Joi.string().required()
}

export {
  loginBody
}