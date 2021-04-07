import supertest from "supertest"
import app from '../../app';
import { expect } from "chai";


describe('Home', () => {
  let request: supertest.SuperTest<supertest.Test>

  before(() => {
    request = supertest(app.callback())
  })

  it('GET NOT Existing route ""', async () => {
    const response = await request.get('/');
    expect(response.status).eql(404);
    expect(response.text).contain('Not Found');
  })
  it('GET basic route /v1/', async () => {
    const response = await request.get('/v1/')
    expect(response.status).eql(200);
    expect(response.text).eql('HOME PAGE');
  })
})
