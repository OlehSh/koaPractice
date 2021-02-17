import { Joi } from "koa-joi-router";
import { relation } from "./general";

const personCreate = {
  name: Joi.string().required(),
  lastName: Joi.string().optional(),
  relation: Joi.object().keys(relation).optional(),
}

const personUpdate = {
  name: Joi.string().optional(),
  lastName: Joi.string().optional(),
  relation: Joi.object().keys(relation).optional(),
}

export {
  personCreate,
  personUpdate
}