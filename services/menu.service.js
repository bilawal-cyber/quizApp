const Mongoose = require("mongoose");
const User = require('../models/user');
const Question = require('../models/questions');
const Answers = require('../models/answers');
const res = require("express/lib/response");
const UserAnswers = require('../models/userAnswers');


//connction string
const uri = "mongodb+srv://bilawal:extra1010@cluster0.guvx3.mongodb.net/quiz-application?retryWrites=true&w=majority";


Mongoose.connect(uri,)
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error));

module.exports = {


    getQuestions: (req, res) => {
        Question.find().populate('answers').exec(function (err, questions) {
            // console.log(err)
            let levelOne = questions.filter((q) => {
                return q.type === '1'
            })
            let levelTwo = questions.filter((q) => {
                return q.type === '2'
            })
            res.status(200).send({ levelOne: levelOne, levelTwo: levelTwo })
        })
    },

    //adding new questions
    addQuestions: (req, res) => {

        const IsValidRequest = IsValidCall(req.body);
        if (!IsValidRequest.success) {
            res.status(400).send({
                error: IsValidRequest.message
            })
        }

        let question = new Question({
            type: req.body.type,
            question: req.body.question
        });

        if (req.body.type == "1") { // MCQs case
            const questionWithAnswers = saveOptionsWithQuestion(req.body.answers, question, res);
            questionWithAnswers.save().then(() => res.status(200).json('save'))
        }
        else { // True/False case
            question.correct_answer = req.body.correct_answer
            question.save().then((result) => res.status(200).json('save'))
        }
    },

    ///player api
    saveUserAnswers: (req, res) => {
        let user = new User({
            email: req.body.email,
            score: req.body.score
        });
        answersList = []
        req.body.responses.forEach(e => {
            const userAns = new UserAnswers({
                question_id: e.question_id,
                answer_id: e.answer_id,
                is_correct: e.is_correct
            })
            answersList.push(userAns)
            user.userAnwers.push(userAns)
        })
        try {
            UserAnswers.insertMany(answersList).then(res => console.log(res))
        } catch (err) {
            console.log(err)
        }
        user.save().then(() => getUserData(user.email, res)).catch((err) => res.status(400).send(err))
    },
    getUserData: (req, res) => {
        getUserData(req.query.email, res)
    }
}

function saveOptionsWithQuestion(answers, question, res) {

    answersList = []
    answers.forEach(element => {
        const option = new Answers({
            option: element.option,
            is_correct: element.is_correct,
        });
        answersList.push(option)
        question.answers.push(option)
    })
    Answers.insertMany(answersList, function (err, options) {
        if (err) {
            console.log(err)
        } else {
            console.log(options)
        }
    })
    return question;
}

function IsValidCall(data) {

    let response = {
        success: true,
        message: []
    }

    if (!data.question) {
        response.success = false
        response.message.push({ name: 'question', message: 'question is required' })
    }

    if (data.type == "1" && data.answers.length < 2) {
        response.success = false
        response.message.push({ name: 'options', message: 'atleast two options are required.' })
    }

    if (data.type == "1" && data.answers.filter(a => !a.option).length) {
        response.success = false
        response.message.push({ name: 'emptyOptions', message: 'Options with empty values sent.' })
    }

    return response;
}
function getUserData(email, res) {
    User.find({ email: email })
        .populate(
            {
                path: 'userAnwers',
                populate:
                {
                    path: 'answer_id question_id',
                    select: 'question correct_answer option'
                },
            }
        )
        .exec(function (err, user) {
            (err) ? console.log(err) : ''
            if (user.length) res.status(200).send(user); else res.status(400).send({ emailNotExist: 'email not exist. please take quiz' })

        })
}