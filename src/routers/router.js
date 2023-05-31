import { router as authenticationRouter } from './authenticationRouter.js'
import { router as destroySessionRouter } from './destroySessionRouter.js'
import { router as catchesRouter } from './catchesRouter.js'
import { router as subscribeRouter } from './subscribeRouter.js'
import Router from 'koa-router'
import 'dotenv/config'

export const router = new Router()

router.get('/', (ctx, next) => {
  let links
  if (ctx.session.auth) {
    links = [
      {
        ref: 'self',
        href: `${process.env.BASE_URL}/`
      },
      {
        ref: 'fish-catches',
        href: `${process.env.BASE_URL}/fish-catches`
      },
      {
        ref: 'log-out',
        href: `${process.env.BASE_URL}/log-out`
      }
    ]
  } else {
    links = [
      {
        ref: 'self',
        href: `${process.env.BASE_URL}/`
      },
      {
        ref: 'fish-catches',
        href: `${process.env.BASE_URL}/fish-catches`
      },
      {
        ref: 'auth',
        href: `${process.env.BASE_URL}/auth`
      }
    ]
  }
  ctx.status = 200
  ctx.body = {
    message: 'Hello, world!',
    _links: links
  }
})

router.use('/auth', authenticationRouter.routes())

router.use('/log-out', destroySessionRouter.routes())

router.use('/fish-catches', catchesRouter.routes())

router.use('/subscribe', subscribeRouter.routes())
