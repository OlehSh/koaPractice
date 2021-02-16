import { Joi } from "koa-joi-router";

const profileSignupBody = {
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  repeatPassword: Joi.string().required().equal(Joi.ref('password'))
}

export {
  profileSignupBody
}