import router from "koa-joi-router";

const data = router();
data.prefix('/data/')
data.get('/',
  (ctx) => {
    console.log("Data")
    ctx.body = {data: "some data"}
  })

export default data;