import router from "koa-joi-router";
import koaPassport from "koa-passport";
import { CONTENT_TYPE } from "../../constants/constants";
import { person as personValidate} from "../../validate/person";
import Person from "../../service/Person";
import { QueryResult } from "neo4j-driver";

const person = router();

person.prefix('/person/')

person.get('/', koaPassport.authenticate('jwt', {session: false }), (ctx) => {
  ctx.body = 'get persons'
})

person.get('/:id', koaPassport.authenticate('jwt', {session: false}), (ctx) => {

  // console.log('TEST', ctx.)
  ctx.body = 'get person by id'
})

person.post('/', {validate: {type: CONTENT_TYPE.JSON, body: personValidate}}, koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
  try {
    const { name, lastName, relation } = ctx.request.body
    ctx.body = await Person.add({ name, lastName, relation })
  } catch (e) {
    console.log(e)
    ctx.throw('Create person error')
  }
})

person.post('/:id', koaPassport.authenticate('jwt', {session: false}), (ctx) => {
  ctx.body = 'edit person data'
})

person.delete('/', koaPassport.authenticate('jwt', {session: false}), async (ctx) => {
  const { id }: {id: string} = ctx.params;
  console.log('DELETE', id)
  const result: QueryResult = await Person.delete(id);
  ctx.assert(result.summary.counters.updates().nodesDeleted !== 0, 404, 'Profile not found')
  ctx.body = 'success'
})

export default person;