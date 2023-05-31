import jwt from 'jsonwebtoken'

/**
 * Middleware helper function to check if user is already authenticated.
 *
 * @param {object} ctx Koa req, res object.
 * @param {object} next Koa next object.
 */
export function alreadyAuthenticatedMiddleware (ctx, next) {
  try {
    if (ctx.session.auth) {
      throw new Error('Already authenticated')
    }
    next()
  } catch (error) {
    ctx.status = 403
    ctx.body = { message: 'Already authenticated' }
  }
}

/**
 * Middleware helper function to check if user is not authenticated.
 *
 * @param {object} ctx Koa req, res object.
 * @param {object} next Koa next object.
 */
export function notAuthenticatedMiddleware (ctx, next) {
  try {
    if (!ctx.session.auth) {
      throw new Error('Not authenticated')
    }
    next()
  } catch (error) {
    ctx.status = 401
    ctx.body = { message: 'You are not authorized.' }
  }
}

/**
 * Middleware helper function to verify a JWT token.
 *
 * @param {object} ctx Koa req, res object.
 * @param {object} next Koa next object.
 */
export async function verifyToken (ctx, next) {
  try {
    const [authHeader, token] = ctx.request.headers.authorization?.split(' ')
    if (authHeader !== 'Bearer') {
      throw new Error('Invalid header')
    }
    const publicKey = process.env.PUBLIC_KEY.replace(/\\n/gm, '\n')
    jwt.verify(token, publicKey)
    await next()
  } catch (error) {
    console.log(error)
    ctx.status = 498
    ctx.body = { error: 'Token invalid, expired or not provided.' }
  }
}
