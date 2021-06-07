import router from "koa-joi-router";
import koaPassport from "koa-passport";
import { container } from "tsyringe";
import { CONTENT_TYPE } from "../../constants/constants";
import { personCreateBodyValidate, personUpdateBodyValidate } from "../../validate/person";
import { deleteRelationBodyValidate } from "../../validate/general";
import Person from "../../service/Person";
import { QueryResult } from "neo4j-driver";
import { DeleteRelationBody } from "../interface";
import { validateSession } from "../../midlware/sessionValidate";

const person = router();
const personService = container.resolve(Person)
person.prefix('/person/')

person.get('/', koaPassport.authenticate('jwt', {session: false}), (ctx) => {
  ctx.body = 'get persons'
})

person.get('/:id', koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
  const {id} = ctx.params
  ctx.body = await personService.fetch(id)
  ctx.body = "success"
})

person.post('/',
  {validate: {type: CONTENT_TYPE.JSON, body: personCreateBodyValidate}},
  koaPassport.authenticate('jwt', {session: false}),
  validateSession,
  async (ctx) => {
    try {
      const {name, lastName, relation} = ctx.request.body
      ctx.body = await personService.add({name, lastName, relation})
      ctx.body = "success"
    } catch (e) {
      ctx.throw('Create person error')
    }
  })

person.post('/:id',
  {validate: {type: CONTENT_TYPE.JSON, body: personUpdateBodyValidate}},
  koaPassport.authenticate('jwt', {session: false}),
  validateSession,
  async (ctx) => {
    const {id} = ctx.params
    ctx.body = await personService.update(id, ctx.request.body)
    ctx.body = "success"
  })

person.delete('/:id', koaPassport.authenticate('jwt', {session: false}),
  validateSession,
  async (ctx) => {
    const result: QueryResult = await personService.delete(ctx.params.id);
    ctx.assert(result.summary.counters.updates().nodesDeleted !== 0, 404, 'Profile not found')
    ctx.body = 'success'
  }
)
person.delete(
  '/:id/relation',
  {validate: {type: CONTENT_TYPE.JSON, body: deleteRelationBodyValidate}},
  koaPassport.authenticate('jwt', {session: false}),
  validateSession,
  async (ctx) => {
    const {id}: { id: string } = ctx.params;
    const {nodeId, direction, nodeLabel, relLabel}: DeleteRelationBody = ctx.request.body;
    const result = await personService.deleteRelation(id, {id: nodeId, nodeLabel, relLabel, direction});
    ctx.assert(result.summary.counters.updates().nodesDeleted !== 0, 404, 'Profile not found')
    ctx.body = 'success'
  })
export default person;