import { container } from "tsyringe";
import Neo4jDriver from "./neo4jDriver";

container.register("Neo4jDriver", {
  useValue: new Neo4jDriver()
})