import { router } from "./routers/router.js"
import 'dotenv/config'
import Koa from 'koa'
import helmet from 'koa-helmet'
import session from "koa-session"
import bodyParser from "koa-bodyparser"
import { connectDB } from "./config/mongoose.js"

try {

  await connectDB()
  
  const app = new Koa()

  app.keys = [process.env.SESSION_SECRET]

  app.use(bodyParser())
  app.use(session(app))
  app.use(helmet())
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
  })

} catch (error) {
  console.log(error)
}

