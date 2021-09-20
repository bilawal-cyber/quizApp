const express = require('express')
const router = express.Router()

const menuService = require('../services/menu.service')

router.get('/getQuestionsLevelOne',menuService.getQuestionsLevelOne)
router.get('/getQuestionsLevelTwo',menuService.getQuestionsLevelTwo)
router.post('/createUser', menuService.addUser)
router.post('/createQuestion',menuService.addQuestions)



module.exports = router