import Router from 'koa-router'
import halson from 'halson' //if not using typescript, ignore error
import { CatchController } from '../controllers/catchController.js'

export const router = new Router()

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

router.get('/register-catch', (ctx, next) => {
  const links = halson({})
  .addLink('self', `${process.env.BASE_URL}/fish-catches`)
  .addLink('entry point', `${process.env.BASE_URL}/`, { method: 'GET' })
ctx.body = {
  statusbar : 200,
  message: 'Abborre',
  _links: links
}
})

router.post('/register-catch', async (ctx, next) => {
  ctx.status = 201
  await controller.registerCatch(ctx, next, "Mirand")
})