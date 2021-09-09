const express = require('express')
const router = express.Router()

const menuService = require('../services/menu.service')

router.get('/', menuService.getMenu)
router.post('/createUser', menuService.addUser)
router.post('/createQuestion',menuService.addQuestions)
// router.post('/createAns',menuService.addMcqAns)



module.exports = router