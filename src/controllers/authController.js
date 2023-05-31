import 'dotenv/config'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'

/**
 * Controller for authentication.
 */
export class AuthController {
  /**
   * Displays main entry with links and info.
   *
   * @param {object} ctx Koa req, res object.
   */
  displayAuthPage (ctx) {
    const links = [
      {
        rel: 'entry-point',
        href: `${process.env.BASE_URL}/`
      },
      {
        rel: 'self',
        href: `${process.env.BASE_URL}/auth`
      },
      {
        rel: 'auth-with-token',
        href: `${process.env.BASE_URL}/auth/auth-with-token`,
        method: 'POST'
      },
      {
        rel: 'token',
        href: `${process.env.BASE_URL}/auth/token`,
        message: 'If authenticated towards GitLab, receive a token here for use on unsafe methods on this API.'
      }
    ]
    ctx.status = 200
    ctx.body = {
      message: 'Page for authentication. Authenticate towards GitLab with OAuth and receive a token. Auth with that token. Then receive a token from this service to use in its API.',
      _links: links
    }
  }

  /**
   * Authenticates a token from an external authorization attempt, allowing
   * the user to become authenticated on this service.
   *
   * @param {object} ctx Koa req, res object.
   * @param {*} baseUrl The base url of the external authenticator.
   */
  async authenticateWithExternalToken (ctx, baseUrl) {
    try {
      let token = ''
      const authHeader = ctx.request.headers.authorization
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
      }
      const response = await fetch(`${baseUrl}/oauth/token/info`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 200) {
        const tokenInfo = await response.json()
        if (tokenInfo.active === true) {
          ctx.status = 200
          ctx.body = 'Authorization token accepted.'
          ctx.session.auth = true
        }
      }
    } catch (error) {
      console.log(error)
      ctx.status = 498
      ctx.body = 'Token invalid or not provided.'
    }
  }

  /**
   * Generates a JWT token for use on this service.
   *
   * @param {object} ctx Koa req, res object.
   * @returns {object} JWT token
   */
  generateInternalToken (ctx) {
    const payload = { user: ctx.session.id }
    const privateKey = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n')
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256'
    })
    return accessToken
  }

  /**
   * Verifies that a token came from this service.
   *
   * @param {object} ctx Koa req, res object.
   * @param {object} next Koa next object.
   */
  verifyInternalToken (ctx, next) {
    try {
      const [authHeader, token] = ctx.request.headers.authorization?.split(' ')
      if (authHeader !== 'Bearer') {
        throw new Error('Invalid header')
      }
      const publicKey = process.env.PUBLIC_KEY.replace(/\\n/gm, '\n')
      jwt.verify(token, publicKey)
      next()
    } catch (error) {
      console.log(error)
      ctx.status = 498
      ctx.body = 'Token invalid or not provided.'
    }
  }
}
