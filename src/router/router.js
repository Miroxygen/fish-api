import { router as authenticationRouter } from "./authenticationRouter.js"
import { router as destroySessionRouter } from "./destroySessionRouter.js"
import Router from 'koa-router'
import halson from 'halson' //if not using typescript, ignore error
import 'dotenv/config'

export const router = new Router()

router.get('/', (ctx, next) => {
  let links
  if(ctx.session.auth) {
    links = halson({})
    .addLink('self', `${process.env.BASE_URL}/`)
    .addLink('log-out', `${process.env.BASE_URL}/log-out`)
  } else {
    links = halson({})
    .addLink('self', `${process.env.BASE_URL}/`)
    .addLink('auth', `${process.env.BASE_URL}/auth`, { method: 'GET' })
  }
  ctx.body = {
    statusbar : 200,
    message: 'Hello, world!',
    _links: links
  }
})

router.use('/auth', authenticationRouter.routes())

router.use('/log-out', destroySessionRouter.routes())
