import Router from 'koa-router'
import 'dotenv/config'
import { verifyToken } from '../middleware/authMiddleware.js'

export const router = new Router()

/**
 * Resolved class from container.
 *
 * @param {object} ctx Koa req, res object.
 * @returns {object} Object of SubscribeController.
 */
const resolveSubscribeController = (ctx) => ctx.container.resolve('SubscribeController')

router.post('/', verifyToken, async (ctx, next) => {
  await resolveSubscribeController(ctx).registerSubscriber(ctx)
})

router.delete('/', verifyToken, async (ctx, next) => {
  await resolveSubscribeController(ctx).deleteSubscriber(ctx)
})
