import Router from 'koa-router'
import halson from 'halson' //if not using typescript, ignore error
import 'dotenv/config'
import { alreadyAuthenticatedMiddleware, notAuthenticatedMiddleware } from '../middleware/authMiddleware.js'

export const router = new Router()


const resolveAuthController = (ctx) => ctx.container.resolve('AuthController')

//const resolveAuthMiddleware = (ctx) => ctx.container.resolve('AuthMiddleware')


router.get('/', alreadyAuthenticatedMiddleware, (ctx, next) => {
  resolveAuthController(ctx).displayAuthPage(ctx)
})

router.post('/auth-with-token', alreadyAuthenticatedMiddleware, async (ctx, next) => {
  await resolveAuthController(ctx).authenticateWithExternalToken(ctx, process.env.BASE_GITLABURL)
})

router.post('/test', notAuthenticatedMiddleware, (ctx, next) => {
  resolveAuthController(ctx).verifyInternalToken(ctx)
})


router.get('/gitlab', alreadyAuthenticatedMiddleware, (ctx, next) => {
  resolveAuthController(ctx).redirectToAuthUrl(ctx)
})

router.get('/gitlab/callback', alreadyAuthenticatedMiddleware, (ctx, next) => {
  resolveAuthController(ctx).handleCallBack(ctx)
})

router.get('/token', notAuthenticatedMiddleware, (ctx, next) => {
  const token = resolveAuthController(ctx).generateInternalToken(ctx)
  const links = halson({})
  .addLink('self', `${process.env.BASE_URL}/auth/token`)
  .addLink('entry point', `${process.env.BASE_URL}/`, { method: 'GET' })
  ctx.body = {
    message : `Use this token for future authenticationrequests : ${token}`,
    _links : links
  }
})