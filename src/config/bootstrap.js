/**
 * Module for bootstrapping.
 */

import { IoCContainer } from "../util/IoCContainer.js"
import { AuthController } from "../controllers/authController.js"
import { CatchController } from "../controllers/catchController.js"
import { GitLabOauthService } from "../services/gitLabOauthSerivce.js"
import { AuthMiddleware } from "../middleware/authMiddleware.js"


const iocContainer = new IoCContainer()

iocContainer.register('GitLabOauthServiceSingleton', GitLabOauthService, {
  singleton : true
})

iocContainer.register('AuthController', AuthController, {
  dependencies : [
    'GitLabOauthServiceSingleton'
  ]
})

iocContainer.register('CatchController', CatchController)

iocContainer.register('AuthMiddleware', AuthMiddleware)

export const container = Object.freeze(iocContainer)