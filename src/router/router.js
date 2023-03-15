import { router as authenticationRouter } from "./authenticationRouter.js"
import Router from 'koa-router'
import halson from 'halson' //if not using typescript, ignore error
import 'dotenv/config'

export const router = new Router()

router.get('/', (ctx, next) => {
  const links = halson({})
    .addLink('self', `${process.env.BASE_URL}/`)
    .addLink('auth', `${process.env.BASE_URL}/auth`, { method: 'GET' })
  ctx.body = {
    statusbar : 200,
    message: 'Hello, world!',
    _links: links
  }
})

router.use('/auth', authenticationRouter.routes())
