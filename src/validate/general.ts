import { Joi } from "koa-joi-router";
import { RELATION_DIRECTION } from "../constants/constants";
import { LABEL } from "../service/interfase";

const relation = {
  id: Joi.string().required(),
  nodeLabel: Joi.string().equal(LABEL.PERSON, LABEL.PROFILE).required(),
  type: Joi.string().required(),
  direction: Joi.number().equal(RELATION_DIRECTION.IN, RELATION_DIRECTION.OUT, RELATION_DIRECTION.TWO_WAY).required(),
  description: Joi.string().optional()
}
const deleteRelationBodyValidate ={
  nodeId: Joi.string().required(),
  relLabel: Joi.string().required(),
  nodeLabel: Joi.string().required().equal(LABEL.PERSON, LABEL.PROFILE),
  direction: Joi.number().equal(RELATION_DIRECTION.IN, RELATION_DIRECTION.OUT, RELATION_DIRECTION.TWO_WAY).required(),
}

export {
  relation,
  deleteRelationBodyValidate
}