import { Joi } from "koa-joi-router";
import { RELATION_DIRECTION } from "../constants/constants";
import { NODE, RELATION } from "../service/interfase";

const relation = {
  id: Joi.string().required(),
  nodeLabel: Joi.string().equal(NODE.PERSON, NODE.PROFILE).required(),
  type: Joi.string().equal(RELATION.CHILD, RELATION.SPOUSE, RELATION.SESSION).required(),
  direction: Joi.number().equal(RELATION_DIRECTION.IN, RELATION_DIRECTION.OUT, RELATION_DIRECTION.TWO_WAY).required(),
  description: Joi.string().optional()
}
const deleteRelationBodyValidate ={
  nodeId: Joi.string().required(),
  relLabel: Joi.string().equal(RELATION.CHILD, RELATION.SPOUSE, RELATION.SESSION).required(),
  nodeLabel: Joi.string().required().equal(NODE.PERSON, NODE.PROFILE),
  direction: Joi.number().equal(RELATION_DIRECTION.IN, RELATION_DIRECTION.OUT, RELATION_DIRECTION.TWO_WAY).required(),
}

export {
  relation,
  deleteRelationBodyValidate
}