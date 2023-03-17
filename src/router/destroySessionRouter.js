import Router from 'koa-router'
import halson from 'halson' //if not using typescript, ignore error

export const router = new Router()

const requireAuth = (ctx, next) => {
  if (ctx.session.auth) {
    return next()
  } else {
    ctx.status = 401
    ctx.body = { message: 'Authentication required' }
  }
}

router.get('/', requireAuth, (ctx, next) => {
  ctx.session = null
  const links = halson({})
  .addLink('entry point', `${process.env.BASE_URL}/`, { method: 'GET' })
  ctx.body = {
    statusbar : 200,
    message: 'Succesfully logged out.',
    _links: links
  }
})