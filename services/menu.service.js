const  Mongoose  = require("mongoose");
const User = require('../models/user');
const Question = require('../models/questions');
const Answers = require('../models/answers');
const res = require("express/lib/response");




//connction string
const uri = "mongodb+srv://bilawal:extra1010@cluster0.guvx3.mongodb.net/quiz-application?retryWrites=true&w=majority";


Mongoose.connect(uri,)
.then((result)=>console.log('connected to db'))
.catch((error)=>console.log(error));

module.exports = {



    getQuestions: (req, res) => {
        Question.
        findOne({ _id: '61465a68e67051355cca7c1b' }).
        populate('answers').
        exec(function (err, user) {
            console.log(err)
                res.send(user)
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
           
                            (req.body.type=="1") ?
                                    (req.body.question && req.body.question.length!=0)?
                                module.exports.saveOptionsWithQuestion(req,question,res)
                                : res.status(400).json('question is required')
                            :
                                question.save()
                                .then((result)=>{
                                    console.log(result)
                                    res.status(200).json(result);
                                })
                                .catch((error)=>{
                                    console.log(error)
                                    res.status(400).json(error);
                                });                            
            // res.status(200).send('save')
    },

    saveOptionsWithQuestion:(req,question,res)=>{
             if(req.body.answers.length>2){
                req.body.answers.forEach(element => {
                    const answers = new Answers({  
                        option : element.option,
                        is_correct : element.is_correct,   
                        });
                    answers.save()
                     question.answers.push(answers)
                })
                question.save()
             }else{
                 res.status(400).send('atleast two options are required')
             }
            
            
    }
}