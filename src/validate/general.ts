import { Joi } from "koa-joi-router";
import { RELATION_DIRECTION } from "../constants/constants";

const relation = {
  id: Joi.string().required(),
  type: Joi.string().required(),
  direction: Joi.number().equal([RELATION_DIRECTION.IN, RELATION_DIRECTION.OUT, RELATION_DIRECTION.TWO_WAY]).required(),
  description: Joi.string().optional()
}

export {
  relation
}