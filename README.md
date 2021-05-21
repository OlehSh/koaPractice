# koaPractice
### Environment
* Node.js version - >=14
* Neo4jDriver version - 4.2 https://neo4j.com/
* docker

### Run project
 * run <code>npm install</code>
 * run <code> npm run docker:up</code> to run neo4j docker container
 * connect to your neo4j server and create a new database with custom name
 * run <code> npm run neo4j:migrate:run</code> to run neo4j migrations
 * run <code>npm run build</code> and <code>npm start </code> to run project
 * run <code>npm run dev</code> to run dev mode

### Test 
* <code> npm run test</code> run tests
* <code> npm run test:coverage</code> check test coverage

### Migration commands
* <code> npm run neo4j:migrate:run</code> run all migrations
* <code> Index=[number] npm run neo4j:migrate:rollback</code> rollback migration
* <code> Index=zero npm run neo4j:migrate:rollback</code> rollback all migrations

### Env file variables
| Variable                |  Default value                                    | Comment                                   |
|-------------------------|:-------------------------------------------------:|-------------------------------------------|
| PORT                    | 3000                                              | node application port                     |
| HOST                    | localhost                                         |                                           |
| NEO4J_PORT              | 7687                                              | neo4j connection port                     |
| NEO4J_PASSWORD          | neo4j                                             |                                           |
| NEO4J_USER              | neo4j                                             |                                           |
| NEO4J_HOST              | localhost                                         |                                           |
| NEO4J_DBNAME            | myapp                                             |                                           |