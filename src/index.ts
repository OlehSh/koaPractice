import app from "./app";
import neo4j from './neo4g';
import env from "./env";

const AppRun = () => {
  neo4j.init()
  app.listen(env.port);
}
void AppRun()