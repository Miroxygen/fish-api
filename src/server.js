import express from "express"
import helmet from "helmet"
import { router } from "./router/router.js"
import 'dotenv/config'


try {

  const app = express()

  app.use(helmet())

  app.use(express.json())

  app.use('/', router)

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
  })
} catch (error) {
  console.log(error)
}
