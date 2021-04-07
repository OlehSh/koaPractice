import supertest from "supertest"
import neo4jDriver from "../neo4jDriver";
import { expect } from "chai";


describe('DB Accses', () => {
  it('Check db connection', async () => {
    const response = await request.get('/');
    expect(neo4jDriver.driver).(404);
    expect(response.text).contain('Not Found');
  })
})

