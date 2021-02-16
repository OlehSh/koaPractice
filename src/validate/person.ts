import { Joi } from "koa-joi-router";
import { relation } from "./general";

const person = {
  name: Joi.string().required(),
  lastName: Joi.string().optional(),
  relation: Joi.object().keys(relation).optional(),
}

export {
  person
}