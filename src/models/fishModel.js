import mongoose from "mongoose"

const schema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  catcher: {
    type: String,
    required: [true, 'Catcher is required.'],
  },
  position: {
    type: String,
    required: [true, 'Position is required.'],
  },
  waterBodyName: {
    type: String,
    required: [true, 'Waterbodyname is required.'],
  },
  city: {
    type: String,
    required: [true, 'City is required.'],
  },
  species: {
    type: String,
    required: [true, 'Species is required.'],
  },
  weight: {
    type: String,
    required: [true, 'Weight is required.'],
  },
  lenght: {
    type: String,
    required: [true, 'Lenght is required.'],
  },
  imageUrl: {
    type: String,
  },
  catchTimestamp: {
    type: String,
    required: [true, 'Timestamp of catch is required.'],
  }
})

export const FishCatch = mongoose.model('FishCatch', schema)