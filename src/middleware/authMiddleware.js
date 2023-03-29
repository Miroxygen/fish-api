import jwt from 'jsonwebtoken'

export class AuthMiddleware {
  constructor() {

  }
  alreadyAuthenticatedMiddleware(ctx, next) {
    if (!ctx.session.auth) {
      return next()
    } else {
      const links = {
        entryPoint : `${process.env.BASE_URL}/`,
      }
      ctx.status = 403 
      ctx.body = { message: 'Already authenticated', _links : links }
    }
  }

  notAuthenticatedMiddleware(ctx, next) {
    if (ctx.session.auth) {
      return next()
    } else {
      const links = {
        entryPoint : `${process.env.BASE_URL}/`,
      }
      ctx.status = 401 
      ctx.body = { message: 'You are not authorized.', _links : links }
    }
  }

}

export function alreadyAuthenticatedMiddleware(ctx, next) {
  if (!ctx.session.auth) {
    return next()
  } else {
    const links = {
      entryPoint : `${process.env.BASE_URL}/`,
    }
    ctx.status = 403 
    ctx.body = { message: 'Already authenticated', _links : links }
  }
}

export function notAuthenticatedMiddleware(ctx, next) {
  if (ctx.session.auth) {
    return next()
  } else {
    const links = {
      entryPoint : `${process.env.BASE_URL}/`,
    }
    ctx.status = 401 
    ctx.body = { message: 'You are not authorized.', _links : links }
  }
}

export async function verifyToken(ctx, next) {
  try {
    const [authHeader, token] = ctx.request.headers['authorization']?.split(' ')
    if (authHeader !== 'Bearer') {
      throw new Error('Invalid header')
    }
    const publicKey = process.env.PUBLIC_KEY.replace(/\\n/gm, '\n')
    jwt.verify(token, publicKey)
    await next()
  } catch (error) {
    console.log(error)
    ctx.status = 401
    ctx.body = {error : "Token invalid, expired or not provided."}
  }
}
