import Koa from 'koa';
import koaBody from "koa-body";
import logger from "koa-logger"
import api from "./router/index";
import koaPassport from "koa-passport";

const app = new Koa<Koa.DefaultState>();

app.use(logger())
app.use(koaPassport.initialize())
app.use(koaPassport.session())
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      status: 'error',
      details: err.message,
    };
    ctx.app.emit('error', err, ctx);
  }
});
app.use(koaBody({
  multipart: true,
  parsedMethods: [ 'POST', 'PUT', 'DELETE', 'PATCH' ],
  formidable: {
    maxFileSize: 10 * 1024 * 1024 // 20 Gb
  }
}));

app.use(api.middleware());

app.on('error', (err, ctx) => {
  console.log('ERROR', err);
  ctx.assert(err, err.status, err.message);
});

export default app
