const router = require('express').Router()
const {getRoom, findRoom} = require('./controller')

router.get("/getRoom/:id", getRoom)
router.get("/totRoom", findRoom)

module.exports = router
