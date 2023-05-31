import { FishCatch } from '../models/fishModel.js'
import 'dotenv/config'

/**
 * Controller for catches.
 */
export class CatchController {
  /**
   * Displays the base of /catches with links and info.
   *
   * @param {object} ctx Koa req, res object.
   */
  displayBaseInformation (ctx) {
    const links = [
      {
        rel: 'entry-point',
        href: `${process.env.BASE_URL}/`
      },
      {
        rel: 'self',
        href: `${process.env.BASE_URL}/fish-catches`
      },
      {
        rel: 'get-all-catches',
        href: `${process.env.BASE_URL}/fish-catches/all-catches`
      },
      {
        rel: 'post-new-catch',
        href: `${process.env.BASE_URL}/fish-catches/register-catch`,
        method: 'POST'
      }
    ]
    ctx.status = 200
    ctx.body = {
      links
    }
  }

  /**
   * Registers a catch to the database.
   *
   * @param {object} ctx Koa req, res object.
   * @param {object} next Koa next object.
   */
  async registerCatch (ctx, next) {
    try {
      const { catcher, position, waterBodyName, city, species, weight, length, imageUrl, catchTimestamp } = ctx.request.body
      const catchId = await this.createCatchId()
      const catchCatch = new FishCatch({
        fish_id: catchId,
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
        ctx.status = 422
        ctx.body = {
          message: 'The request cannot or will not be processed due to something that is perceived to be a client error (for example validation error).'
        }
      } else {
        ctx.status = 500
        ctx.body = {
          message: 'An unexpected condition was encountered.'
        }
      }
    }
  }

  /**
   * Returns all catches from the database.
   *
   * @param {object} ctx Koa req, res object.
   * @param {object} next Koa next object.
   * @returns {Array} Array of catches.
   */
  async getAllCatches (ctx, next) {
    try {
      let catches = await FishCatch.find()
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
        catchTimestamp: fish.catchTimestamp,
        links: [
          {
            rel: 'self',
            href: `${process.env.BASE_URL}/fish-catches/catch${fish.fish_id}`
          },
          {
            rel: 'update',
            href: `${process.env.BASE_URL}/fish-catches/catch${fish.fish_id}`,
            method: 'PUT'
          },
          {
            rel: 'partial-update',
            href: `${process.env.BASE_URL}/fish-catches/catch${fish.fish_id}`,
            method: 'PATCH'
          },
          {
            rel: 'delete',
            href: `${process.env.BASE_URL}/fish-catches/catch${fish.fish_id}`,
            method: 'DELETE'
          }
        ]
      }))
      ctx.status = 200
      ctx.body = { catches }
    } catch (error) {
      ctx.status = 500
      ctx.body = { Message: 'Internal server error.' }
    }
  }

  /**
   * Returns one catch from the database based on param id.
   *
   * @param {object} ctx Koa req, res object.
   */
  async getFishCatchById (ctx) {
    try {
      const fishCatch = await FishCatch.find({ fish_id: parseInt(ctx.params.id) })
      if (fishCatch && fishCatch[0] !== undefined) {
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
          catchTimestamp: fish.catchTimestamp,
          links: [
            {
              rel: 'self',
              href: `${process.env.BASE_URL}/fish-catches/catch${fish.fish_id}`
            },
            {
              rel: 'update',
              href: `${process.env.BASE_URL}/fish-catches/catch${fish.fish_id}`,
              method: 'PUT'
            },
            {
              rel: 'partial-update',
              href: `${process.env.BASE_URL}/fish-catches/catch${fish.fish_id}`,
              method: 'PATCH'
            },
            {
              rel: 'delete',
              href: `${process.env.BASE_URL}/fish-catches/catch${fish.fish_id}`,
              method: 'DELETE'
            }
          ]
        }))
        ctx.status = 200
        ctx.body = { Catch: catchData }
      } else {
        ctx.status = 404
        ctx.body = { error: 'The requested resource was not found.' }
      }
    } catch (error) {
      console.log(error)
      ctx.status = 500
      ctx.body = { Message: 'Internal server error.' }
    }
  }

  /**
   * PUT request for catch, updating all the required fields.
   *
   * @param {object} ctx Koa req, res object.
   */
  async putCatch (ctx) {
    try {
      const { catcher, position, waterBodyName, city, species, weight, length, catchTimestamp } = ctx.request.body
      const catchInfo = { catcher, position, waterBodyName, city, species, weight, length, catchTimestamp }
      for (const [key, value] of Object.entries(catchInfo)) {
        if (key === undefined || value === undefined) {
          ctx.status = 400
          ctx.body = {
            message: 'The request cannot or will not be processed due to something that is perceived to be a client error (for example validation error).'
          }
          break
        } else {
          await FishCatch.updateOne({ fish_id: parseInt(ctx.params.id) }, ctx.request.body)
          ctx.status = 200
          ctx.body = { Message: `Succesfull PUT of entry with id: ${ctx.params.id}` }
        }
      }
    } catch (error) {
      console.log(error)
      ctx.status = 500
      ctx.body = { Message: 'Internal server error.' }
    }
  }

  /**
   * Patch request that updates certain fields of one catch.
   *
   * @param {object} ctx Koa req, res object.
   */
  async patchCatch (ctx) {
    try {
      await FishCatch.updateOne({ fish_id: parseInt(ctx.params.id) }, ctx.request.body)
      ctx.status = 200
      ctx.body = { Message: `Succesfully patched entry with id: ${ctx.params.id}` }
    } catch (error) {
      console.log(error)
      ctx.status = 500
      ctx.body = { Message: 'Internal server error.' }
    }
  }

  /**
   * Deletes a catchentry from the database.
   *
   * @param {object} ctx Koa req, res object.
   */
  async deleteCatch (ctx) {
    try {
      const result = await FishCatch.deleteOne({ fish_id: parseInt(ctx.params.id) })
      if (result.deletedCount === 1) {
        ctx.status = 200
        ctx.body = { Message: `Succesfully deleted entry with id: ${ctx.params.id}` }
      }
    } catch (error) {
      console.log(error)
      ctx.status = 500
      ctx.body = { Message: 'Internal server error.' }
    }
  }

  /**
   * Returns the id of the latest entry from catches.
   *
   * @param {object} ctx Koa req, res object.
   * @param {object} next Koa next object.
   * @returns {number} Fishcatch id.
   */
  async getLatestId (ctx, next) {
    const latestCatch = await FishCatch.find().limit(1).sort({ $natural: -1 })
    return latestCatch[0].fish_id
  }

  /**
   * Creates an ID based on the latest id.
   *
   * @returns {number} Number ID.
   */
  async createCatchId () {
    const latestId = await this.getLatestId()
    const catchId = latestId + 1
    return catchId
  }
}
