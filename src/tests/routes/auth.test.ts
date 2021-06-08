import 'reflect-metadata'
import supertest from 'supertest'
import app from '../../app';
import { expect } from 'chai';
import { testUser as user } from '../mock/user.json'

describe('Auth', () => {
  let request: supertest.SuperTest<supertest.Test>
  let token = '';
  before(() => {
    request = supertest(app.callback())
  })

  it('POST signup "/v1/auth/signup"', async () => {
    // try{
    const response = await request
      .post('/v1/auth/signup')
      .set('Accept', '*/*')
      .send(user)
    expect(response.status).eql(200, 'Response status should be 200')
    expect(response.body).keys(['id', 'email', 'name'])
    expect(response.body).have.property('name', 'testUser', 'name should be "testUser"')
    expect(response.body).have.property('email', 'test@test.com', 'email should be "test@test.com"')
  })

  it('POST Login /v1/auth/login', async () => {
    const response =  await request
      .post('/v1/auth/login')
      .set('Accept', '*/*')
      .send({email: user.email, password: user.password})
    expect(response.body).keys(['token'])
    token = response.body.token as string
  })
  it ('POST Login /v1/auth/logout', async () => {
    const response =  await request
      .post('/v1/auth/logout')
      .set('Accept', '*/*')
      .auth( token, { type: "bearer" })
      .send({email: user.email, password: user.password})
    expect(response.status).eql(200)

    expect(response.body).keys(['message'])
    expect(response.body.message).eql('logged out')
  })

  it('POST signup same user "/v1/auth/signup"', async () => {
    const response = await request
      .post('/v1/auth/signup')
      .set('Accept', '*/*')
      .send(user)
    expect(response.status).eql(500, 'Response status should be 500')
  })

  it ('POST Login not authorized /v1/auth/logout', async () => {
    const response =  await request
      .post('/v1/auth/logout')
      .set('Accept', '*/*')
      .send({email: user.email, password: user.password})
    expect(response.status).eql(401)
  })
})

