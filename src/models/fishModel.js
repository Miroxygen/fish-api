import mongoose from 'mongoose'

/**
 * Model for fishcatch in DB.
 */
const schema = new mongoose.Schema({
  fish_id: {
    type: Number,
    required: true
  },
  catcher: {
    type: String,
    required: [true, 'Catcher is required.']
  },
  position: {
    type: String,
    required: [true, 'Position is required.']
  },
  waterBodyName: {
    type: String,
    required: [true, 'Waterbodyname is required.']
  },
  city: {
    type: String,
    required: [true, 'City is required.']
  },
  species: {
    type: String,
    required: [true, 'Species is required.']
  },
  weight: {
    type: String,
    required: [true, 'Weight is required.']
  },
  length: {
    type: String,
    required: [true, 'Length is required.']
  },
  imageUrl: {
    type: String
  },
  catchTimestamp: {
    type: String,
    required: [true, 'Timestamp of catch is required.']
  }
})

export const FishCatch = mongoose.model('FishCatch', schema)
