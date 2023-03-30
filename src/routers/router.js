import { router as authenticationRouter } from "./authenticationRouter.js"
import { router as destroySessionRouter } from "./destroySessionRouter.js"
import { router as catchesRouter } from "./catchesRouter.js"
import { router as subscribeRouter } from "./subscribeRouter.js"
import Router from 'koa-router'
import halson from 'halson' //if not using typescript, ignore error
import 'dotenv/config'

export const router = new Router()

router.get('/', (ctx, next) => {
  let links
  if(ctx.session.auth) {
    links = halson({})
    .addLink('self', `${process.env.BASE_URL}/`)
    .addLink('fish-catches', `${process.env.BASE_URL}/fish-catches`, { method: 'GET'})
    .addLink('log-out', `${process.env.BASE_URL}/log-out`, { method: 'GET'})
  } else {
    links = halson({})
    .addLink('self', `${process.env.BASE_URL}/`)
    .addLink('fish-catches', `${process.env.BASE_URL}/fish-catches`, { method: 'GET'})
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

router.use('/fish-catches', catchesRouter.routes())

router.use('/subscribe', subscribeRouter.routes())
