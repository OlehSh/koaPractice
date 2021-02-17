import router from "koa-joi-router";
import koaPassport from "koa-passport";
import { CONTENT_TYPE } from "../../constants/constants";
import { personCreate, personUpdate} from "../../validate/person";
import Person from "../../service/Person";
import { QueryResult } from "neo4j-driver";

const person = router();

person.prefix('/person/')

person.get('/', koaPassport.authenticate('jwt', {session: false }), (ctx) => {
  ctx.body = 'get persons'
})

person.get('/:id', koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
  const { id } = ctx.params
  ctx.body = await Person.fetch(id)
})

person.post('/', {validate: {type: CONTENT_TYPE.JSON, body: personCreate}}, koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
  try {
    const { name, lastName, relation } = ctx.request.body
    ctx.body = await Person.add({ name, lastName, relation })
  } catch (e) {
    console.log(e)
    ctx.throw('Create person error')
  }
})

person.post('/:id', {validate: {type: CONTENT_TYPE.JSON, body: personUpdate}}, koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
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
person.delete('relation/:id', koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
  ctx.body = "delete RELATION from person"
})
export default person;