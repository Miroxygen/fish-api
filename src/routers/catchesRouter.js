import Router from 'koa-router'
import { verifyToken } from '../middleware/authMiddleware.js'

export const router = new Router()

/**
 * Resolved class from container.
 *
 * @param {object} ctx Koa req, res object.
 * @returns {object} Object of CatchController.
 */
const resolveCatchController = (ctx) => ctx.container.resolve('CatchController')
/**
 * Resolved class from container.
 *
 * @param {object} ctx Koa req, res object.
 * @returns {object} Object of SubscribeController.
 */
const resolveSubscribeController = (ctx) => ctx.container.resolve('SubscribeController')

router.get('/', (ctx, next) => {
  resolveCatchController(ctx).displayBaseInformation(ctx)
})

router.get('/all-catches', verifyToken, async (ctx, next) => {
  await resolveCatchController(ctx).getAllCatches(ctx, next)
})

router.get('/catch/:id', verifyToken, async (ctx, next) => {
  await resolveCatchController(ctx).getFishCatchById(ctx)
})

router.put('/catch/:id', verifyToken, async (ctx, next) => {
  await resolveCatchController(ctx).putCatch(ctx)
})

router.patch('/catch/:id', verifyToken, async (ctx, next) => {
  await resolveCatchController(ctx).patchCatch(ctx)
})

router.delete('/catch/:id', verifyToken, async (ctx, next) => {
  await resolveCatchController(ctx).deleteCatch(ctx)
})

router.post('/register-catch', verifyToken, async (ctx, next) => {
  await resolveCatchController(ctx).registerCatch(ctx, next)
  await resolveSubscribeController(ctx).sendPostToSubscribers(ctx, ctx.request.body)
})
