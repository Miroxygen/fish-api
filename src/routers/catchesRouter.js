import Router from 'koa-router'
import halson from 'halson' //if not using typescript, ignore error

export const router = new Router()

router.get('/', (ctx, next) => {
  const links = halson({})
  .addLink('self', `${process.env.BASE_URL}/fish-catches`)
  .addLink('entry point', `${process.env.BASE_URL}/`, { method: 'GET' })
ctx.body = {
  statusbar : 200,
  message: 'Fångad fisk!',
  _links: links
}
})