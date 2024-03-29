const Mongoose = require("mongoose");
const User = require('../models/user');
const Question = require('../models/questions');
const Answers = require('../models/answers');
const res = require("express/lib/response");
const UserAnswers = require('../models/userAnswers');
var https = require('http');


//connction string
const uri = "mongodb://quizApp:qwerty1010@3.144.188.60:27017/Quiz";


Mongoose.connect(uri,)
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error));

module.exports = {

//curl -XGET "http://localhost:9200/products/_search" -H 'Content-Type: application/json' -d'{  "query": {    "match_all": {}  }}'

    getElasticData:(req,response)=>{


        // jsonObject = JSON.stringify({
        //     "message" : "The web of things is approaching, let do some tests to be ready!",
        //     "name" : "Test message posted with node.js",
        // });
         
        // // prepare the header
        // var postheaders = {
        //     'Content-Type' : 'application/json',
        //     'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
        // };
         
        // // the post options
        // var optionspost = {
        //     host : '18.219.47.64',
        //     port : 80,
        //     path : '/products/_doc',
        //     method : 'POST',
        //     headers : postheaders
        // };
         
        // console.info('Options prepared:');
        // console.info(optionspost);
        // console.info('Do the POST call');
         
        // // do the POST call
        // var reqPost = https.request(optionspost, function(res) {
        //     console.log("statusCode: ", res.statusCode);
        //     // uncomment it for header details
        // //  console.log("headers: ", res.headers);
         
        //     res.on('data', function(d) {
        //         console.info('POST result:\n');
        //         process.stdout.write(d);
        //         console.info('\n\nPOST completed');
        //     });
        // });
         
        // // write the json data
        // reqPost.write(jsonObject);
        // reqPost.end();
        // reqPost.on('error', function(e) {
        //     console.error(e);
        // });






        var optionsget = {
            host : '18.219.47.64', // here only the domain name
            // (no http/https !)
            port : 80,
            path : '/products/_search', // the rest of the url with parameters if needed
            method : 'GET' // do GET
        };
         
        console.info('Options prepared:');
        console.info(optionsget);
        console.info('Do the GET call');

        var reqGet = https.request(optionsget, function(res) {
            console.log("statusCode: ", res.statusCode);
         
         
            res.on('data', function(d) {
                process.stdout.write(d);
                response.status(200).send(d)
            });
         
        });
         
        reqGet.end();
        reqGet.on('error', function(e) {
            console.error(e);
        });

    },


    getQuestions: (req, res) => {
        if (req.query.admin) {
            Question.find({}, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    result=result.filter(q=>q.is_active)
                    res.json(result);
                }
            });
        } else {
            Question.find().populate('answers').exec(function (err, questions) {
                let levelOne = questions.filter(q => q.type === '1' && q.is_active)
                let levelTwo = questions.filter(q => q.type === '2' && q.is_active)


                levelOne.map(b => b.answers = b.answers.filter(c => c.is_active))
                res.status(200).json({ levelOne: levelOne, levelTwo: levelTwo })
            })
        }
    },
    getQuestionForResult : (req,res) =>{
        Question.find({}).populate('answers').exec(function (err, questions) {
            if(err){
                console.log(err)
            }
            let levelOne = questions.filter(q => q.type === '1')
            let levelTwo = questions.filter(q => q.type === '2')
            // console.log( {levelOne: levelOne, levelTwo: levelTwo })
            res.status(200).send({ levelOne: levelOne, levelTwo: levelTwo })
        })
    },
    getSingleQuestion: (req, res) => {
        Question.find({ _id: req.query._id }).populate('answers').exec(function (err, question) {
            if(err){
                console.log(err)
            }else{
                question[0].answers=question[0].answers.filter(a=>a.is_active)
                res.status(200).json(question)
            }
        })
    },
    getAllUsers:async(req,res)=>{
    let user=await User.distinct("email")
        
res.status(200).send(user)
    },

    viewQusetion:(req,res) => {
        const ans = UserAnswers.find({"question_id":req.query._id}).select("userAns").select("is_correct")
        ans.exec(function(err,ans){
            if(err){
                console.log(err)
            }else{
                res.status(200).send(ans)
            }
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
                  Answers.findOneAndUpdate({_id:a._id},{option:a.option,is_correct:a.is_correct},function(err,doc){
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
        Answers.findByIdAndUpdate(req.query._id,{is_active:false},function(err,docs){
            if(err){
                console.log(err)
            }else{
                res.status(200).send("deleted")
            }
        })
    },
    delQuestion:(req,res) =>{
        Question.findByIdAndUpdate(req.query._id,{is_active:false},function(err,docs){
            if(err){
                console.log(err)
            }else{
                res.status(200).send({message:'success'})
            }

        })
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
