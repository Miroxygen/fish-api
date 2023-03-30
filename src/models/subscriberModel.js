import mongoose from "mongoose"

const schema = new mongoose.Schema({
  url : {
    type : String,
    required : true,
    unique : true
  },
  clientSecret : {
    type : String,
    required : true,
    unique : true
  }
})

export const Subscriber = mongoose.model('Subscriber', schema)