import router  from "koa-joi-router";
import koaPassport from "koa-passport";
import { CONTENT_TYPE } from "../../constants/constants";
import { personCreateBodyValidate, personUpdateBodyValidate} from "../../validate/person";
import { deleteRelationBodyValidate } from "../../validate/general";
import Person from "../../service/Person";
import { QueryResult } from "neo4j-driver";
import { DeleteRelationBody } from "../interface";

const person = router();
person.prefix('/person/')

person.get('/', koaPassport.authenticate('jwt', {session: false }), (ctx) => {
  ctx.body = 'get persons'
})

person.get('/:id', koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
  const { id } = ctx.params
  ctx.body = await Person.fetch(id)
})

person.post('/', {validate: {type: CONTENT_TYPE.JSON, body: personCreateBodyValidate}}, koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
  try {
    const { name, lastName, relation } = ctx.request.body
    ctx.body = await Person.add({ name, lastName, relation })
  } catch (e) {
    console.log(e)
    ctx.throw('Create person error')
  }
})

person.post('/:id', {validate: {type: CONTENT_TYPE.JSON, body: personUpdateBodyValidate }}, koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
  const { id } = ctx.params
  ctx.body = await Person.update(id, ctx.request.body)
})

person.delete('/:id', koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
  const { id }: {id: string} = ctx.params;
  console.log('DELETE', id)
  const result: QueryResult = await Person.delete(id);
  ctx.assert(result.summary.counters.updates().nodesDeleted !== 0, 404, 'Profile not found')
  ctx.body = 'success'
})
person.delete(
  '/:id/relation',
  {validate: {type: CONTENT_TYPE.JSON, body: deleteRelationBodyValidate}},
  koaPassport.authenticate('jwt', {session: false}),
  async (ctx) => {
    const {id}: { id: string } = ctx.params;
    const {nodeId, direction, nodeLabel, relLabel }:DeleteRelationBody = ctx.request.body;
    const result = await Person.deleteRelation(id, {id: nodeId, nodeLabel, relLabel, direction});
    ctx.assert(result.summary.counters.updates().nodesDeleted !== 0, 404, 'Profile not found')
    ctx.body = 'success'
  })
export default person;