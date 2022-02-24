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
router.get('/getQuestionsForResult',menuService.getQuestionForResult)
router.get('/view/question',menuService.viewQusetion)

router.get('/all/users',menuService.getAllUsers)

router.get('/elastci',menuService.getElasticData)

module.exports = router