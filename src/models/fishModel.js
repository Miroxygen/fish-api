import mongoose from "mongoose"

const schema = new mongoose.Schema({
  catcher: {
    type: String,
    required: [true, 'Catcher is required.'],
    match: [/^[A-Za-z][A-Za-z0-9_-]{2,255}$/, 'Please provide a valid name.']
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
  },
})