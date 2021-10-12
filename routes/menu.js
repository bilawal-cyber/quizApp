const express = require('express')
const router = express.Router()

const menuService = require('../services/menu.service')

router.get('/getQuestions',menuService.getQuestions)
router.get('/getSingleQuestion',menuService.getSingleQuestion)
router.post('/updateQuestion',menuService.updateQuestion)
router.post('/createQuestion',menuService.addQuestions)
router.post('/user/Answers',menuService.saveUserAnswers)
router.get('/userData',menuService.getUserData)
router.get('/user/all/records',menuService.userAllRecords)
router.get('/del/options',menuService.deleteOptions)
router.get('/del/question',menuService.delQuestion)



module.exports = router