import 'reflect-metadata'
import supertest from 'supertest'
import app from '../../app';
import { expect } from 'chai';
import { testUser as user } from '../mock/user.json'

describe('Profile', () => {
  let request: supertest.SuperTest<supertest.Test>
  let token = ''
  before(() => {
    request = supertest(app.callback())
  })

  it('GET profile unauthorised', async () => {
    const response =  await request.get('/v1/profile')
    expect(response.status).eql(401)
  })

  it('POST profile unauthorised', async () => {
    const response =  await request
      .post('/v1/profile')
      .send()
    expect(response.status).eql(401)
  })

  it('DELETE profile unauthorised', async () => {
    const response =  await request
      .delete('/v1/profile')
      .send()
    expect(response.status).eql(401)
  })

  it('DELETE specific profile unauthorised', async () => {
    const response =  await request
      .delete(`/v1/profile/any-id`)
      .send()
    expect(response.status).eql(401)
  })

  it('Get auth token', async () => {
    const response = await request
      .post('/v1/auth/login')
      .set('Accept', '*/*')
      .send({email: user.email, password: user.password})
    token = response.body.token as string
  })

  it('GET profile authorized', async () => {
    const resp =  await request.get('/v1/profile')
      .auth(token, {type: 'bearer'})
      .send()
    expect(resp.status).eql(200)
  })

  it('POST profile authorized', async () => {
    const resp =  await request
      .post('/v1/profile')
      .auth(token, {type: 'bearer'})
      .send()
    expect(resp.status).eql(200)
  })

  it('DELETE profile by not existing id authorized', async () => {
    const userId = 12312432423423
    const response =  await request
      .delete(`/v1/profile/${userId}`)
      .auth(token, {type: 'bearer'})
      .send()
    expect(response.status).eql(404)
    expect(response.body.details).eql("Profile not found")
  })

  it('DELETE profile by existing id authorized', async () => {
    const userId = 1232424234234
    const response =  await request
      .delete(`/v1/profile/${userId}`)
      .auth(token, {type: 'bearer'})
      .send()
    expect(response.status).eql(200)
  })

  it('DELETE profile authorized', async () => {
    const resp =  await request
      .delete('/v1/profile')
      .auth(token, {type: 'bearer'})
      .send()
    expect(resp.status).eql(200)
  })

  it('GET profile after delete', async () => {
    const response =  await request
      .post('/v1/profile')
      .auth(token, {type: 'bearer'})
      .send()
    expect(response.status).eql(401)
  })
})

