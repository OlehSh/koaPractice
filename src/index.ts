import "reflect-metadata"
import app from "./app";
import { container } from "tsyringe";
import Neo4jDriver from "./neo4jDriver";
import env from "./env";
import { Server } from "http";
import { AddressInfo } from "net";

const neo4j = container.resolve(Neo4jDriver)
console.log("Neo4g ===>", neo4j)
const AppRun = async (): Promise<void> => {
  await neo4j.init();
  const server: Server = app.listen(env.port);
  const { port } = server.address() as AddressInfo
  console.log(`SERVER is running on port ${port}`)
}
void AppRun()