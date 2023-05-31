import { router } from './routers/router.js'
import 'dotenv/config'
import Koa from 'koa'
import helmet from 'koa-helmet'
import session from 'koa-session'
import bodyParser from 'koa-bodyparser'
import { connectDB } from './config/mongoose.js'
import { container } from './config/bootstrap.js'
import { TestDataManager } from './util/testDataManager.js'

try {
  await connectDB()

  const app = new Koa()

  app.use(async (ctx, next) => {
    ctx.container = container
    await next()
  })

  app.keys = [process.env.SESSION_SECRET]

  app.use(bodyParser())
  app.use(session(app))
  app.use(helmet())
  app.use(router.routes())
  app.use(router.allowedMethods())

  const testDataManager = new TestDataManager()

  process.on('SIGINT', async () => {
    await TestDataManager.removeTestData()
    process.exit()
  })

  app.listen(process.env.PORT, async (ctx) => {
    await testDataManager.populateTestData()
    console.log(`Server running at http://localhost:${process.env.PORT}`)
  })
} catch (error) {
  console.log(error)
}
