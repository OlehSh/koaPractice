import router from "koa-joi-router";
import checkAuthentication from "../../midlware/checkAuthentication";

const person = router();
person.prefix('/person/')
person.get('/', (ctx) => {
  ctx.body = 'get persons'
})
person.get('/:id', (ctx) => {

  // console.log('TEST', ctx.)
  ctx.body = 'get person by id'
})

person.post('/', (ctx) => {
  ctx.body = 'add new persons'
})

person.post('/:id', (ctx) => {
  ctx.body = 'edit person data'
})

person.delete('/', (ctx) => {
  ctx.body = 'delete persons'
})

export default person;