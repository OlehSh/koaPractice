import neo4j from "../neo4jDriver";
import { Session } from "neo4j-driver";

interface Properties {
  [key: string]: string | number | boolean
}

export abstract class NeoModel {
  protected constructor(protected session = neo4j.session) {}
  // private session: Session
}
