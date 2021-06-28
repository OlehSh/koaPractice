import 'reflect-metadata'
import supertest from 'supertest'
import app from '../../../app';
import { expect } from 'chai';
import { personTestUser as user } from '../../mock/user.json'
import { testPerson1, testPerson2, personRelationChild } from '../../mock/persons.json'

describe('Person', () => {
  let request: supertest.SuperTest<supertest.Test>
  let token = ''
  let personId = ''
  let secondPersonId = ''
  before(() => {
    request = supertest(app.callback())
  })

  it('GET person unauthorized', async () => {
    const response = await request.get('/v1/person')
    expect(response.status).eql(401)
  })
  it('GET person by id unauthorized', async () => {
    const response = await request.get('/v1/person/p-id')
    expect(response.status).eql(401)
  })

  it('POST create person unauthorized', async () => {
    const response = await request
      .post('/v1/person')
      .set('Accept', '*/*')
      .send(testPerson1)
    expect(response.status).eql(401)
  })

  it('POST update person by id unauthorized', async () => {
    const response = await request
      .post('/v1/person/person-id')
      .set('Accept', '*/*')
      .send(testPerson1)
    expect(response.status).eql(401)
  })


  it('DELETE  person by id unauthorized', async () => {
    const response = await request
      .delete('/v1/person/person-id')
      .set('Accept', '*/*')
      .send()
    expect(response.status).eql(401)
  })

  it('DELETE  person relation by postId and relationId unauthorized', async () => {
    const response = await request
      .delete('/v1/person/person-id/relation')
      .set('Accept', '*/*')
      .send({nodeId: 'node-id', relLabel: "CHILD", nodeLabel: personRelationChild.nodeLabel, direction: personRelationChild.direction })
    expect(response.status).eql(401)
  })
  it('POST signup', async () => {
    const response = await request
      .post('/v1/auth/signup')
      .set('Accept', '*/*')
      .send(user)
    expect(response.status).eql(200, 'Response status should be 200')
  })

  it('Get auth token', async () => {
    const response = await request
      .post('/v1/auth/login')
      .set('Accept', '*/*')
      .send({email: user.email, password: user.password})
    token = response.body.token as string
  })
  it('POST create person authorized', async () => {
    const response = await request
      .post('/v1/person')
      .set('Accept', '*/*')
      .auth(token, { type: "bearer" })
      .send(testPerson1)

    personId = response.body.id as string
    expect(response.status).eql(200)
    expect(response.body).keys(['id', 'lastName', 'name'])
    expect(response.body.name).eql(testPerson1.name)
    expect(response.body.lastName).eql(testPerson1.lastName)
  })

  it('POST create second person', async () => {
    testPerson2.relation = {
      id: personId,
      ...personRelationChild
    }
    const response = await request
      .post('/v1/person')
      .set('Accept', '*/*')
      .auth(token, { type: "bearer" })
      .send(testPerson2)
    secondPersonId = response.body.id as string
    expect(response.status).eql(200)
  })

  it('GET person authorized', async () => {
    const response = await request
      .get('/v1/person')
      .auth(token, { type: "bearer"})
      .send()
    expect(response.status).eql(200)

    // this part not ready
    // expect(response.body).length(2, "Body length should be 2")
    // expect(response.body[0]).eql({name: testPerson1.name, lastName: testPerson1.lastName}, "Body length should be 1")
  })

  it('POST update person by id authorized', async () => {
    const name = "newPName"
    const lastName = "newLastName"
    const response = await request
      .post(`/v1/person/${personId}`)
      .auth(token, { type: "bearer" })
      .set('Accept', '*/*')
      .send({name, lastName})
    expect(response.status).eql(200)
    expect(response.body.name).eql(name)
    expect(response.body.lastName).eql(lastName)
  })


  it('DELETE  person relation by postId and relationId authorize', async () => {
    const response = await request
      .delete(`/v1/person/${personId}/relation`)
      .set('Accept', '*/*')
      .auth(token, { type: "bearer"})
      .send({ nodeId: secondPersonId, relLabel: "SPOUSE", nodeLabel: personRelationChild.nodeLabel, direction: personRelationChild.direction })
    expect(response.status).eql(200)
    expect(response.body).keys(["relationshipsDeleted"])
    expect(response.body.relationshipsDeleted).eql(2)
  })

  it('DELETE  person by id authorized', async () => {
    const response = await request
      .delete(`/v1/person/${personId}`)
      .set('Accept', '*/*')
      .auth(token, { type: "bearer"})
      .send()
    expect(response.status).eql(200)
    expect(response.body).keys(['nodesDeleted'])
    expect(response.body.nodesDeleted).eql(1)
  })
  //

})

