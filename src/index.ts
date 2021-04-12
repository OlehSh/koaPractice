import "reflect-metadata"
import app from "./app";
import env from "./env";
import { Server } from "http";
import { AddressInfo } from "net";

const AppRun = (): void => {
  const server: Server = app.listen(env.port);
  const { port } = server.address() as AddressInfo
  console.log(`SERVER is running on port ${port}`)
}
void AppRun()