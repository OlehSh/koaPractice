import app from "./app";
import neo4j from './neo4jDriver';
import env from "./env";
import { Server } from "http";
import { AddressInfo } from "net";



const AppRun = async (): Promise<void> => {
  await neo4j.init();
  console.log(env.port);
  const server: Server = app.listen(env.port);
  const { port } = server.address() as AddressInfo
  console.log(`SERVER is running on port ${port}`)
}
void AppRun()