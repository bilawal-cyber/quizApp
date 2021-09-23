const Mongoose = require("mongoose");
const User = require('../models/user');
const Question = require('../models/questions');
const Answers = require('../models/answers');
const res = require("express/lib/response");
const UserAnswers=require('../models/userAnswers');


//connction string
const uri = "mongodb+srv://bilawal:extra1010@cluster0.guvx3.mongodb.net/quiz-application?retryWrites=true&w=majority";


Mongoose.connect(uri,)
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error));

module.exports = {


    getQuestions : (req,res)=>{
            Question.find().populate('answers').exec(function(err,questions){
                console.log(err)
                let levelOne = questions.filter((q)=>{
                    return q.type === '1'
                })
                let levelTwo = questions.filter((q)=>{
                    return q.type === '2'
                })
                res.status(200).send({levelOne:levelOne,levelTwo:levelTwo})
            })        
    },

    //register player
    // addUser: (req, res) => {
    //     const user = new User({
    //         email: req.body.email,
    //     })
    //     user.save()
    //         .then((result) => {
    //             console.log(result)
    //             res.status(200).json(result);
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //             res.status(400).json(error);
    //         });

    // },


    //adding new questions
    addQuestions: (req, res) => {

        const IsValidRequest = IsValidCall(req.body);
        if(!IsValidRequest.success){
            res.status(400).send({
                error: IsValidRequest.message
            })
        }

        let question = new Question({
            type: req.body.type,
            question: req.body.question
        });

        if(req.body.type == "1" ) { // MCQs case
            const questionWithAnswers = saveOptionsWithQuestion(req.body.answers, question, res);
            questionWithAnswers.save().then(() => res.status(200).json('save'))
        }
        else{ // True/False case
            question.correct_answer = req.body.correct_answer
            question.save().then((result) =>  res.status(200).json('save'))
        }
    },

    ///player api
    saveUserAnswers:(req,res)=>{
            
    }

   
}

function saveOptionsWithQuestion(answers, question, res){

    answers.forEach(element => {
        const option = new Answers({
            option: element.option,
            is_correct: element.is_correct,
        });
        option.save()
        question.answers.push(option)
    })
    return question;
}

function IsValidCall(data){

    let response = {
        success: true,
        message: []
    }

    if(!data.question ){
        response.success = false
        response.message.push({name:'question',message:'question is required'})
    }

    if (data.type == "1" && data.answers.length < 2) {
        response.success = false
        response.message.push({name:'options',message:'atleast two options are required.'})
    }

    if( data.type == "1" &&  data.answers.filter(a => !a.option).length ){
        response.success = false
        response.message.push({name:'emptyOptions',message:'Options with empty values sent.'})
    }

    return response;
}
