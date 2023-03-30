import { GitLabOauthService } from '../services/gitLabOauthSerivce.js'
import 'dotenv/config'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'


export class AuthController {
  constructor(service = new GitLabOauthService) {
    this.service = service
  }

  displayAuthPage(ctx) {
    const links = {
      'self' : `${process.env.BASE_URL}/auth`,
      'entry point' : `${process.env.BASE_URL}/`,
      'authentication-redirect' : `${process.env.BASE_URL}/auth/gitlab`,
      'authentication with token' : `${process.env.BASE_URL}/auth/auth-with-token`,
    }
    ctx.status = 200
    ctx.body = {
      message: 'Page for authentication. Authentication redirect will redirect you to a webpage for authentication. With token you post an authentication token for authentication.',
      _links: links
    }
  }

  redirectToAuthUrl(ctx) {
    const url = this.service.getAuthorizationUrl()
    ctx.redirect(url)
  }

  async handleCallBack(ctx) {
    const code = ctx.query.code
    const data = await this.service.getAccessData(code)
    ctx.session.token = data.access_token
    ctx.session.id = data.id_token
    ctx.session.auth = true
    ctx.redirect(`/auth/token`)
  }

  async authenticateWithExternalToken(ctx, baseUrl) {
    try {
      let token = ""
      const authHeader = ctx.request.headers['authorization']
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
      const response = await fetch(`${baseUrl}/oauth/token/info`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if(response.status === 200) {
        const tokenInfo = await response.json()
        if(tokenInfo.active === true) {

        }
      }
      ctx.status = 200
      ctx.body = "Authorization token accepted."
      ctx.session.auth = true
    } catch (error) {
      console.log(error)
      ctx.status = 401
      ctx.body = "Token invalid or not provided."
    }
  }

  generateInternalToken(ctx) {
    const tokenExpirationToNumber = parseInt(process.env.TOKEN_EXPIRATION)
    const tokenExpirationTime = Math.floor(Date.now() / 1000) + tokenExpirationToNumber
    const payload = {user : ctx.session.id}
    console.log(payload)
    const privateKey = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n')
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm : 'RS256'
    })
    return accessToken
  }

  verifyInternalToken(ctx, next) {
    try {
      const [authHeader, token] = ctx.request.headers['authorization']?.split(' ')
      if (authHeader !== 'Bearer') {
        throw new Error('Invalid header')
      }
      const publicKey = process.env.PUBLIC_KEY.replace(/\\n/gm, '\n')
      const decoded = jwt.verify(token, publicKey)
      console.log(decoded.user)
      next()
    } catch (error) {
      console.log(error)
      ctx.status = 401
      ctx.body = "Token invalid or not provided."
    }
  }
}