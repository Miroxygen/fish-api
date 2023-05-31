import Router from 'koa-router'
import { notAuthenticatedMiddleware } from '../middleware/authMiddleware.js'

export const router = new Router()

router.get('/', notAuthenticatedMiddleware, (ctx, next) => {
  ctx.session = null
  const links = [
    {
      rel: 'entry-point',
      href: `${process.env.BASE_URL}/`
    }
  ]
  ctx.status = 200
  ctx.body = {
    message: 'Succesfully logged out.',
    _links: links
  }
})
