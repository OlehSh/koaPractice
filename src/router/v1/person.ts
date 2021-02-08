import router from "koa-joi-router";
import checkAuthentication from "../../midlware/checkAuthentication";

const person = router();
person.get('/person', checkAuthentication,(ctx) => {
  ctx.body = 'get persons'
})
person.get('/person/:id', checkAuthentication, (ctx) => {
  ctx.body = 'get person by id'
})

person.post('/person', (ctx) => {
  ctx.body = 'add new persons'
})

person.post('/person/:id', (ctx) => {
  ctx.body = 'edit person data'
})

person.delete('/person', (ctx) => {
  ctx.body = 'delete persons'
})

export default person;