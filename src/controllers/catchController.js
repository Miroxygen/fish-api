import { FishCatch } from '../models/fishModel.js'
import 'dotenv/config'


export class CatchController {
  constructor() {

  }

  async registerCatch(ctx, next, owner) {
    try {
      console.log(ctx.request.body)
      const  {catcher, position, waterBodyName, city, species, weight, lenght, imageUrl, catchTimestamp} = ctx.request.body
      const fishCatch = new FishCatch({
        owner,
        catcher,
        position,
        waterBodyName,
        city,
        species,
        weight,
        lenght,
        imageUrl,
        catchTimestamp
      })
      await fishCatch.save()
      ctx.status = 201
      ctx.body = 'Fish succesfully created.'
    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log(error)
        ctx.status = 400
        ctx.body = {
          statusbar : 400,
          message : "The request cannot or will not be processed due to something that is perceived to be a client error (for example validation error)."
        }
      } else {
        console.log(error)
        ctx.status = 500
        ctx.body = {
          statusbar : 500,
          message : "An unexpected condition was encountered."
        }
      }

    }
  }
}