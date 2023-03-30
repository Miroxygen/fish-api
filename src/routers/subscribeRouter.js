import Router from 'koa-router'
import 'dotenv/config'
import { verifyToken} from '../middleware/authMiddleware.js'

export const router = new Router()

const resolveSubscribeController = (ctx) => ctx.container.resolve('SubscribeController')


router.post('/', verifyToken, async (ctx, next) => {
  await resolveSubscribeController(ctx).registerSubscriber(ctx)
})

router.delete('/', verifyToken, async (ctx, next) => {
  await resolveSubscribeController(ctx).deleteSubscriber(ctx)
})

