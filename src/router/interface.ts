import { LABEL } from "../service/interfase";
import { RELATION_DIRECTION } from "../constants/constants";

export interface DeleteRelationBody {
  nodeId: string,
  nodeLabel: LABEL,
  relLabel: string,
  direction: RELATION_DIRECTION
}