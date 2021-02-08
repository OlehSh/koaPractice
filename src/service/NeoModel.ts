import neo4j from "../neo4g";
import { Session } from "neo4j-driver";

interface Properties {
  [key: string]: string | number | boolean
}
export default class NeoModel {
  constructor(protected session: Session = neo4j.session!) {}
  protected create(label: string, props: Properties): void{
    console.log('CREATE', label)
    console.log('CREATE', props)
  }
}
