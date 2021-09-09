const  Mongoose  = require("mongoose");
const Schema = Mongoose.Schema;

const answerSchema = new Schema({
    question_id : {
        type : Schema.ObjectId,
        ref :  'Question'
    },
    option : {
        type: String,
        required : true,
     },
    is_correct:{
        type:String,
        enum:[true,false],
        default: false
    }

    

},
{
    timestamps:true
})

const Answers = Mongoose.model('Answer',answerSchema);

module.exports = Answers;