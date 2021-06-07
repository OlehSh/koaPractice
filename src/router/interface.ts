import { NODE, RELATION } from "../service/interfase";
import { RELATION_DIRECTION } from "../constants/constants";

export interface DeleteRelationBody {
  nodeId: string,
  nodeLabel: NODE,
  relLabel: RELATION,
  direction: RELATION_DIRECTION
}