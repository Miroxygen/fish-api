import axios from 'axios'
import validator from 'validator'
import { Subscriber } from '../models/subscriberModel.js'

/**
 * Controller for subscriptions to API.
 */
export class SubscribeController {
  /**
   * Register a subscriber for webhook event.
   *
   * @param {object} ctx Koa req, res object.
   */
  async registerSubscriber (ctx) {
    try {
      const { url, clientSecret } = ctx.request.body
      if (!url || !clientSecret) {
        ctx.status = 422
        ctx.body = 'Invalid subscription data'
      } else if (!validator.isURL(url)) {
        ctx.status = 422
        ctx.body = 'Invalid URL'
      } else {
        const subscriber = new Subscriber({
          url,
          clientSecret
        })
        await subscriber.save()
        ctx.status = 200
        ctx.body = 'Subscription created successfully'
      }
    } catch (error) {
      if (error.code === 11000) {
        ctx.status = 400
        ctx.body = 'Duplicate subscription URL'
      } else {
        console.log(error)
        ctx.status = 500
        ctx.body = 'Internal server error'
      }
    }
  }

  /**
   * Removes a subscriber from webhooks service.
   *
   * @param {object} ctx Koa req, res object.
   */
  async deleteSubscriber (ctx) {
    try {
      const clientSecret = ctx.request.body
      if (!clientSecret) {
        ctx.throw(400, 'Invalid clientsecret')
      }
      const result = await Subscriber.deleteOne({ clientSecret })
      if (result.deletedCount === 1) {
        ctx.status = 200
        ctx.body = { Message: `Succesfully deleted entry with id: ${ctx.params.id}` }
      } else {
        ctx.throw(404, 'Subscriber not found')
      }
    } catch (error) {
      ctx.throw(500, 'Internal server error')
    }
  }

  /**
   * Retrieves all subscribers from the database.
   */
  async getAllSubscribers () {
    let subscribers = await Subscriber.find()
    subscribers = subscribers.map(subscriber => ({
      url: subscriber.url,
      clientSecret: subscriber.clientSecret
    }))
    return subscribers
  }

  /**
   * Sends a POST to all subscribers with relevant webhook info.
   *
   * @param {object} ctx Koa req, res object.
   * @param {object} webhook Object containing relevant webhook info.
   */
  async sendPostToSubscribers (ctx, webhook) {
    try {
      const subscribers = await this.getAllSubscribers()
      if (subscribers.length === 0) {
        console.error(404, 'No subscribers found')
      }
      const webhookJson = JSON.stringify(webhook)
      subscribers.forEach(async (subscriber) => {
        try {
          const response = await axios.head(subscriber.url, {
            headers: {
              Accept: 'application/json',
              'X-API-Secret': subscriber.clientSecret
            }
          })
          if (response.status === 200) {
            // If the server is reachable, send the webhook
            await axios.post(subscriber.url, webhookJson, {
              headers: {
                Accept: 'application/json',
                'X-API-Secret': subscriber.clientSecret,
                'Content-Type': 'application/json'
              }
            })
            console.log(`Webhook sent to subscriber: ${subscriber.url}`)
          } else {
            console.error(`Invalid response from ${subscriber.url}: ${response.status}`)
          }
        } catch (error) {
          console.error(`Error sending webhook to ${subscriber.url}:`, error)
        }
      })
      ctx.set('Connection', 'close')
    } catch (error) {
      ctx.throw(500, 'Internal server error')
    }
  }
}
