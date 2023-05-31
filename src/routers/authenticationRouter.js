import Router from 'koa-router'
import 'dotenv/config'
import { alreadyAuthenticatedMiddleware, notAuthenticatedMiddleware } from '../middleware/authMiddleware.js'

export const router = new Router()

/**
 * Resolved class from container.
 *
 * @param {object} ctx Koa req, res object.
 * @returns {object} Object of AuthController.
 */
const resolveAuthController = (ctx) => ctx.container.resolve('AuthController')

router.get('/', alreadyAuthenticatedMiddleware, (ctx, next) => {
  resolveAuthController(ctx).displayAuthPage(ctx)
})

router.post('/auth-with-token', alreadyAuthenticatedMiddleware, async (ctx, next) => {
  await resolveAuthController(ctx).authenticateWithExternalToken(ctx, process.env.BASE_GITLABURL)
})

router.get('/token', notAuthenticatedMiddleware, (ctx, next) => {
  const token = resolveAuthController(ctx).generateInternalToken(ctx)
  const links = [
    {
      rel: 'self',
      href: `${process.env.BASE_URL}/auth/token`
    },
    {
      rel: 'entry-point',
      href: `${process.env.BASE_URL}/`
    }
  ]
  ctx.status = 200
  ctx.body = {
    message: `Use this token for future authenticationrequests : ${token}`,
    _links: links
  }
})
