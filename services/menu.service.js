const express = require('express')
const  Mongoose  = require("mongoose");
const User = require('../models/user');
const Question = require('../models/questions');
const Answers = require('../models/answers');




//connction string
const uri = "mongodb+srv://bilawal:extra1010@cluster0.guvx3.mongodb.net/quiz-application?retryWrites=true&w=majority";


Mongoose.connect(uri,)
.then((result)=>console.log('connected to db'))
.catch((error)=>console.log(error));

module.exports = {



    getMenu: (req, res) => {
        Question.
        find({ _id: '6139d1e7f9a36ba93d2106a4' }).
        populate('Answers').
        exec(function (err, user) {
            console.log(err,'error')
                res.send(user)
          // prints "The author is Ian Fleming"
        });
    },

    //register player
    addUser: (req, res) => {
        const user = new User({
            email : req.body.email,
        })
        user.save()
            .then((result)=>{
                console.log(result)
                res.send(result);
            })
            .catch((error)=>{
                console.log(error)
                res.send(error);
            });

    },


    //adding new questions
    addQuestions: (req, res) => {

            const question = new Question({
                type : req.body.type,
                question : req.body.question,
                correct_answer : req.body.correct_answer,
            });
            question.save()
                    .then((result)=>{
                            if(req.body.type==1)
                            {
                                req.body.answers.forEach(element => {
                                    const answers = new Answers({  
                                        option : element.option,
                                        is_correct : element.is_correct,
                                        question_id: question._id   
                                        });
                                    answers.save()
                                            .then((result)=>{
                                                res.send(result) //set headers error
                                            })
                                            .catch((error)=>{
                                                console.log(error)
                                            })
                                });
                                    }
                            else
                            {
                                res.send(result);
                            }
                        
                    })
                    .catch((error)=>{
                        res.send(error);
                    });
    },

    //questions which have mcqs
    // addMcqAns :(req, res) => {

    //     const answers = new Answers({
    //         option : req.body.option,
    //         is_correct : req.body.is_correct,
    //         question_id : req.body.question_id
    //     });
    //     answers.save()
    //             .then((result)=>{
    //                 res.send(result);
    //             })
    //             .catch((error)=>{
    //                 res.send(error);
    //             });
        
    // }
}