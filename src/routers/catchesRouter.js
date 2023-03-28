import Router from 'koa-router'
import halson from 'halson' //if not using typescript, ignore error
import { verifyToken } from '../middleware/authMiddleware.js'
import { CatchController } from '../controllers/catchController.js'

export const router = new Router()

const resolveCatchController = (ctx) => ctx.container.resolve('CatchController')

const controller = new CatchController()

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


router.get('/catch/:id',  async (ctx, next) => {
    await resolveCatchController(ctx).getFishCatchById(ctx)
})


router.post('/register-catch', verifyToken,  async (ctx, next) => {
  await resolveCatchController(ctx).registerCatch(ctx, next)
  ctx.status = 201
})