const Mongoose = require("mongoose");
const User = require('../models/user');
const Question = require('../models/questions');
const Answers = require('../models/answers');
const res = require("express/lib/response");
const UserAnswers = require('../models/userAnswers');


//connction string
const uri = "mongodb+srv://bilawal:extra1010@cluster0.wa9pr.mongodb.net/quiz-front-end?retryWrites=true&w=majority";


Mongoose.connect(uri,)
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error));

module.exports = {


    getQuestions: (req, res) => {
        if (req.query.admin) {
            Question.find({}, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.json(result);
                }
            });
        } else {
            Question.find().populate('answers').exec(function (err, questions) {
                // if(questions.filter(q=>q.type==='1')){
                // levelOne.map((q) => {
                //     let answers = q.answers.map((a) => {
                //       return { ...a, userAns: null };  //adding user Answer
                //     });
                //     return { ...q, answers };
                //   });
                // }
                let levelOne = questions.filter(q => q.type === '1')
                let levelTwo = questions.filter(q => q.type === '2')


                res.status(200).json({ levelOne: levelOne, levelTwo: levelTwo })
            })
        }
    },
    getSingleQuestion: (req, res) => {
        Question.find({ _id: req.query._id }).populate('answers').exec(function (err, question) {
            res.status(200).json(question)
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
                userAns: e.userAns,
                is_correct: e.is_correct,
            })
            answersList.push(userAns)
            user.userAnwers.push(userAns)
        })
        try {
            UserAnswers.insertMany(answersList).then(res => console.log(res))
        } catch (err) {
            console.log(err)
        }
        user.save().then(() => res.status(200).send({ message: 'success' })).catch((err) => res.status(400).send(err))
    },
    getUserData: (req, res) => {
        getUserData(req.query.id, res)
    },
    userAllRecords: (req, res) => {
        User.find({ email: req.query.email })
            .exec(function (err, user) {
                (err) ? console.log(err) : ''
                if (user.length) res.status(200).send(user); else res.status(400).send({ emailNotExist: 'email not exist. please take quiz' })
            })
    },
    updateQuestion: async(req, res) => {
            let question=req.body;
        const que =await Question.findById(question._id)
        if(question.type==='1'){
            if(question.is_change){
                que.question=question.question
            }
            answersList = []
            question.answers.forEach(a=>{
                if(a.is_change){
                  Answers.findOneAndUpdate({_id:a._id},{$set:{option:a.option}},function(err,doc){
                      if(err){
                          console.log('updating options err',err)
                      }
                  })
                }
                if(a.is_new){
                  const option = new Answers({
                      option: a.option,
                      is_correct: a.is_correct,
                  });
                  answersList.push(option)
                    que.answers.push(option._id)
                }
            })
            Answers.insertMany(answersList, function (err, options) {
              if (err) {
                  console.log(err)
              } else {
                  console.log(options)
              }
              que.save()
              res.status(200).send({message:'succes'})
          })
        }else{
            console.log(question.correct_answer)
            que.question=question.question;
            que.correct_answer=question.correct_answer;
            que.save()
            res.status(200).send({message:'success'})
        }
    },
    deleteOptions:(req,res)=>{
        // console.log(req.query._id)
        Answers.deleteOne({ _id: req.query._id }, function (err,ans) {
            if(err) console.log(err); else console.log("Successful deletion");
            res.status(200).send(ans)      
          });
          Question.findOneAndUpdate({_id:req.query._id},{$pull:{answers:req.query._id}},function(err){
            if(err){
                console.log('err in del question answers array',err)
            }
          })
    },
    delQuestion:(req,res) =>{
        console.log(req.query._id)
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
function getUserData(id, res) {
    User.find({ _id: id })
        .populate(
            {
                path: 'userAnwers',
                populate:
                {
                    path: 'userAns question_id',
                    select: 'question option'
                },
            }
        )
        .exec(function (err, user) {
            (err) ? console.log(err) : ''
            if (user.length) res.status(200).send(user); else res.status(400).send({ emailNotExist: 'email not exist. please take quiz' })

        })
}
