/**
 * Module for bootstrapping.
 */

import { IoCContainer } from "../util/IoCContainer.js"
import { AuthController } from "../controllers/authController.js"
import { CatchController } from "../controllers/catchController.js"
import { GitLabOauthService } from "../services/gitLabOauthSerivce.js"
import { AuthMiddleware } from "../middleware/authMiddleware.js"
import { SubscribeController } from "../controllers/subscribeController.js"


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

iocContainer.register('SubscribeController', SubscribeController)

export const container = Object.freeze(iocContainer)