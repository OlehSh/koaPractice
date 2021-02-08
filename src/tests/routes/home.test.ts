import request from "supertest"
import app from '../../app';
import {expect} from "chai"

const appTest = request(app.listen(3000));


describe('Home', () => {
  it('GET NOT Existing route ""', async () => {
    const response = await appTest.get('/')
    expect(response.status).eql(404);
    expect(response.text).contain('Not Found');
  })
  it('GET basic route /v1/', async () => {
    const response = await appTest.get('/v1/')
    expect(response.status).eql(200);
    expect(response.text).eql('HOME PAGE');
  })
})
