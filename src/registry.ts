import { container } from "tsyringe";
import Neo4jDriver from "./neo4jDriver";

container.register("Neo4jDriverInstance", {
  useClass: Neo4jDriver
})