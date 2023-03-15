import { router } from "./router/router.js"
import 'dotenv/config'
import Koa from 'koa'
import helmet from 'koa-helmet'

const app = new Koa()

app.use(helmet())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`)
})
