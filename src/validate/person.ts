import { Joi } from "koa-joi-router";
import { relation } from "./general";

const personCreateBodyValidate = {
  name: Joi.string().required(),
  lastName: Joi.string().optional(),
  relation: Joi.object().keys(relation).optional(),
}

const personUpdateBodyValidate = {
  name: Joi.string().optional(),
  lastName: Joi.string().optional(),
  relation: Joi.object().keys(relation).optional(),
}

export {
  personCreateBodyValidate,
  personUpdateBodyValidate
}