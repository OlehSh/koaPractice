import supertest  from "supertest"
import app from '../../app';
import { expect } from "chai";

const testUSer = {
  name: "testUser",
  email: "wwwww@test.com",
  password: "1234567844",
  repeatPassword: "1234567844"
}

describe('Auth', () => {
  describe('Routing integration', () => {
    let request: supertest.SuperTest<supertest.Test>

    before(() => {
      request = supertest(app.callback())
    })
    it('POST basic route /v1/auth/signup', (done) => {
      return request
        .post('/v1/auth/signup')
        .set('Content-Type', 'application/json')
        .send(testUSer)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.status).eql(200)
          expect(response.text).eql('HOME PAGE');
          done();
        })

    })

    it('POST Login  request', async () => {
      const response = await request.post('/v1/auth/login')
      expect(response.status).eql(404)
      expect(response.text).contain('Not Found');
    })
  })
})

