import app from "./app";
import neo4j from './neo4jDriver';
import env from "./env";

const AppRun = async (): Promise<void> => {
  await neo4j.init();
  app.listen(env.port);
}
void AppRun()