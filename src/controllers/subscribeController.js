import axios from "axios"
import { Subscriber } from "../models/subscriberModel.js"


export class SubscribeController {
  constructor() {

  }

  /**
   * Register a subscriber for webhook event.
   * @param {object} ctx Koa req, res object.
   */
  async registerSubscriber (ctx) {
    try {
      console.log(ctx.request.body)
      const { url, clientSecret } = ctx.request.body
      if (!url || !clientSecret) {
        ctx.throw(400, 'Invalid subscription data')
      }
      const subscriber = new Subscriber({
        url,
        clientSecret
      })
      await subscriber.save()
      ctx.status = 200;
      ctx.body = 'Subscription created successfully'
    } catch (error) {
      
    }
  }

  /**
   * Removes a subscriber from webhooks service.
   * @param {object} ctx Koa req, res object.
   */
  async deleteSubscriber(ctx) {
    try {
      const clientSecret  = ctx.request.body
      if (!clientSecret) {
        ctx.throw(400, 'Invalid clientsecret')
      }
      const result = await Subscriber.deleteOne({ clientSecret : clientSecret })
        if(result.deletedCount === 1) {
          ctx.status = 200
          ctx.body = {Message : `Succesfully deleted entry with id: ${ctx.params.id}`}
        }
    } catch (error) {
      
    }
  }

  /**
   * Retreives all subscribers from the database.
   */
  async getAllSubscribers() {
    let subscribers = await Subscriber.find()
    subscribers = subscribers.map(subscriber => ({
      url : subscriber.url,
      clientSecret : subscriber.clientSecret
    }))
    return subscribers
  }

  /**
   * Sends a POST to all subscribers with relevant webhook info.
   * @param {object} webhook Object containing relevant webhook info.
   */
  async sendPostToSubscribers(ctx, webhook) {
    try {
      const subscribers = await this.getAllSubscribers()
      const webhookJson = JSON.stringify(webhook)
      subscribers.forEach(async (subscriber) => {
        await axios.post(subscriber.url, webhookJson, {
          headers: {
            Accept : 'application/json',
            'X-API-Secret' : subscriber.clientSecret,
            'Content-Type' : 'application/json'
          }
        })
        ctx.set('Connection', 'close')
        console.log(`Webhook sent to subscriber: ${subscriber.url}`)
    })
    } catch (error) {
      console.error(`Error sending webhook.`, error)
    }
  }
}