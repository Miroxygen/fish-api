import express from "express"

export const router = express.Router()

router.use('/', (req, res, next) => {
  res
        .status(200)
        .json({ message: 'Kanelbullar' })

})