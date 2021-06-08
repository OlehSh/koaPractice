import { NODE_LABEL, RELATION_LABEL } from "../service/interfase";
import { RELATION_DIRECTION } from "../constants/constants";

export interface DeleteRelationBody {
  nodeId: string,
  nodeLabel: NODE_LABEL,
  relLabel: RELATION_LABEL,
  direction: RELATION_DIRECTION
}