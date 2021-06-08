import { Joi } from "koa-joi-router";
import { RELATION_DIRECTION } from "../constants/constants";
import { NODE_LABEL, RELATION_LABEL } from "../service/interfase";

const relation = {
  id: Joi.string().required(),
  nodeLabel: Joi.string().equal(NODE_LABEL.PERSON, NODE_LABEL.PROFILE).required(),
  type: Joi.string().equal(RELATION_LABEL.CHILD, RELATION_LABEL.SPOUSE, RELATION_LABEL.SESSION).required(),
  direction: Joi.number().equal(RELATION_DIRECTION.IN, RELATION_DIRECTION.OUT, RELATION_DIRECTION.TWO_WAY).required(),
  description: Joi.string().optional()
}
const deleteRelationBodyValidate ={
  nodeId: Joi.string().required(),
  relLabel: Joi.string().equal(RELATION_LABEL.CHILD, RELATION_LABEL.SPOUSE, RELATION_LABEL.SESSION).required(),
  nodeLabel: Joi.string().required().equal(NODE_LABEL.PERSON, NODE_LABEL.PROFILE),
  direction: Joi.number().equal(RELATION_DIRECTION.IN, RELATION_DIRECTION.OUT, RELATION_DIRECTION.TWO_WAY).required(),
}

export {
  relation,
  deleteRelationBodyValidate
}