const express = require('express')
const router = express.Router()

const menuService = require('../services/menu.service')

router.get('/getQuestions',menuService.getQuestions)
router.post('/createUser', menuService.addUser)
router.post('/createQuestion',menuService.addQuestions)



module.exports = router