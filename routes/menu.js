const express = require('express')
const router = express.Router()

const menuService = require('../services/menu.service')

router.get('/getQuestions',menuService.getQuestions)
router.post('/createQuestion',menuService.addQuestions)
router.post('/user/Answers',menuService.saveUserAnswers)
// router.get('/userData',menuService.getUserData)



module.exports = router