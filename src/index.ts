import app from "./app";
import neo4j from 'neo4j-driver';

const AppRun = () => {
    console.log('APP run');
    const driver: typeof neo4j.Driver = neo4j.driver(" bolt://100.26.226.98:33413", neo4j.auth.basic('neo4j', 'sprayers-skin-brooms'));
    const session: typeof  neo4j.Session = driver.session();
    console.log('SESSION', session)
    const server = app.listen(4100);
    console.log(server.address());
}
void AppRun()