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



    getQuestions: (req, res) => {
        Question.
        findOne({ _id: '6143d0a71834fdc26dec89dd' }).
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
           
                            if(req.body.type==1)
                            {
                                req.body.answers.forEach(element => {
                                    const answers = new Answers({  
                                        option : element.option,
                                        is_correct : element.is_correct,   
                                        });
                                    answers.save()
                                            question.answers.push(answers)
                                })
                            question.save()
                                    }
                            else
                            {
                                res.send(result);
                            }
    },
}