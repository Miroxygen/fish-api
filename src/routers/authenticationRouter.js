import Router from 'koa-router'
import halson from 'halson' //if not using typescript, ignore error
import { GitLabOauthService } from '../services/gitLabOauthSerivce.js'
import { AuthController } from '../controllers/authController.js'
import 'dotenv/config'

export const router = new Router()

const service = new GitLabOauthService(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL, process.env.BASE_GITLABURL)
const authController = new AuthController(service)


router.get('/', authController.alreadyAuthenticatedMiddleware, (ctx, next) => {
  authController.displayAuthPage(ctx)
})

router.post('/auth-with-token', authController.alreadyAuthenticatedMiddleware, async (ctx, next) => {
  await authController.authenticateWithToken(ctx, process.env.BASE_GITLABURL)
})


router.get('/gitlab', authController.alreadyAuthenticatedMiddleware, (ctx, next) => {
  authController.redirectToAuthUrl(ctx)
})

router.get('/gitlab/callback', authController.alreadyAuthenticatedMiddleware, async (ctx, next) => {
  authController.handleCallBack(ctx)
})

router.get('/token', (ctx, next) => {
  const links = halson({})
  .addLink('self', `${process.env.BASE_URL}/auth/token`)
  .addLink('entry point', `${process.env.BASE_URL}/`, { method: 'GET' })
  ctx.body = {
    message : `Use this token for future authenticationrequests : ${ctx.session.token}`,
    _links : links
  }
})