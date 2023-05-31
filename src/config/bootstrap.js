/**
 * Module for bootstrapping.
 */

import { IoCContainer } from '../util/IoCContainer.js'
import { AuthController } from '../controllers/authController.js'
import { CatchController } from '../controllers/catchController.js'
import { SubscribeController } from '../controllers/subscribeController.js'
import { TestDataManager } from '../util/testDataManager.js'

const iocContainer = new IoCContainer()

iocContainer.register('AuthController', AuthController)

iocContainer.register('CatchController', CatchController)

iocContainer.register('SubscribeController', SubscribeController)

iocContainer.register('TestDataManager', TestDataManager)

export const container = Object.freeze(iocContainer)
