import { FishCatch } from '../models/fishModel.js'
import 'dotenv/config'


export class CatchController {
  constructor() {

  }

  async registerCatch(ctx, next) {
    try {
      const  {catcher, position, waterBodyName, city, species, weight, length, imageUrl, catchTimestamp} = ctx.request.body
      const catchId = await this.createCatchId()
      const catchCatch = new FishCatch({
        fish_id : catchId,
        catcher,
        position,
        waterBodyName,
        city,
        species,
        weight,
        length,
        imageUrl,
        catchTimestamp
      })
      await catchCatch.save()
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

  async getAllCatches(ctx, next) {
    try {
      let catches = await FishCatch.find();
      catches = catches.map(fish => ({
        fishId: fish.fish_id,
        catcher: fish.catcher,
        position: fish.position,
        waterBodyName: fish.waterBodyName,
        city: fish.city,
        species: fish.species,
        weight: fish.weight,
        length: fish.length,
        imageUrl: fish.imageUrl,
        catchTimestamp: fish.catchTimestamp
      }))
      return catches
    } catch (error) {
      console.log(error)
      ctx.status = 500
      ctx.body = { Message: "Internal server error." }
      throw error
    }
  }

  async getFishCatchById(ctx) {
    try {
      const fishCatch = await FishCatch.find({ fish_id : parseInt(ctx.params.id)})
      if(fishCatch) {
        const catchData = fishCatch.map(fish => ({
          fishId: fish.fish_id,
          catcher: fish.catcher,
          position: fish.position,
          waterBodyName: fish.waterBodyName,
          city: fish.city,
          species: fish.species,
          weight: fish.weight,
          length: fish.length,
          imageUrl: fish.imageUrl,
          catchTimestamp: fish.catchTimestamp
        }))
        ctx.status = 200
        ctx.body = {Catch : catchData}
      } else {
        ctx.status = 404
        ctx.body = {error : "The requested resource was not found."}
      }
    } catch (error) {
      console.log(error)
      ctx.status = 500
      ctx.body = { Message: "Internal server error." }
    }
  }

  async getCatchCount(ctx, next) {
    const catchCount = await FishCatch.countDocuments()
    return catchCount
  }

  async createCatchId() {
    const catchCount = await this.getCatchCount()
    const catchId = catchCount  + 1
    return catchId
  }
}