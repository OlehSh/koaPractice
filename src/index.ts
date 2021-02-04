import app from "./app";
import neo4j from 'neo4j-driver';
import env from "./env";

const AppRun = () => {
    console.log('ENV:', env)
    const driver: typeof neo4j.Driver = neo4j.driver(`bolt://${env.neo4j.host}:${env.neo4j.port}`, neo4j.auth.basic(env.neo4j.user, env.neo4j.password));
    const session: typeof  neo4j.Session = driver.session({ database: env.neo4j.dbName});
    console.log('SESSION', session)
    const server = app.listen(env.port);
    console.log(server.address());
}
void AppRun()