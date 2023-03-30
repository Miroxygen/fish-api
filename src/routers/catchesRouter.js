import Router from 'koa-router'
import halson from 'halson' //if not using typescript, ignore error
import { verifyToken } from '../middleware/authMiddleware.js'

export const router = new Router()

const resolveCatchController = (ctx) => ctx.container.resolve('CatchController')
const resolveSubscribeController = (ctx) => ctx.container.resolve('SubscribeController')


router.get('/', (ctx, next) => {
  const links = halson({})
  .addLink('self', `${process.env.BASE_URL}/fish-catches`)
  .addLink('entry point', `${process.env.BASE_URL}/`, { method: 'GET' })
  .addLink('register-catch', `${process.env.BASE_URL}/fish-catches/register-catch`, {method : 'POST'})
ctx.body = {
  statusbar : 200,
  message: 'Fångad fisk!',
  _links: links
}
})

router.get('/all-catches', verifyToken, async (ctx, next) => {
  try {
    const catches = await resolveCatchController(ctx).getAllCatches(ctx, next)
    ctx.status = 200
    ctx.body = { catches }
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { error: 'Internal server error' }
  }
})


router.get('/catch/:id', verifyToken,  async (ctx, next) => {
    await resolveCatchController(ctx).getFishCatchById(ctx)
})

router.put('/catch/:id', verifyToken,  async (ctx, next) => {
  await resolveCatchController(ctx).putCatch(ctx)
})

router.patch('/catch/:id', verifyToken,  async (ctx, next) => {
  await resolveCatchController(ctx).patchCatch(ctx)
})

router.delete('/catch/:id', verifyToken,  async (ctx, next) => {
  await resolveCatchController(ctx).deleteCatch(ctx)
})


router.post('/register-catch', verifyToken,  async (ctx, next) => {
  await resolveCatchController(ctx).registerCatch(ctx, next)
  await resolveSubscribeController(ctx).sendPostToSubscribers(ctx, ctx.request.body)
  ctx.status = 201
})