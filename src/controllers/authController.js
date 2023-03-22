import { GitLabOauthService } from '../services/gitLabOauthSerivce.js'
import Router from 'koa-router'
import 'dotenv/config'


export class AuthController {
  constructor(service = new GitLabOauthService) {
    this.service = service
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
}