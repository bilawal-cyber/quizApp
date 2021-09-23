const  Mongoose  = require("mongoose");
const Schema = Mongoose.Schema;

const answerSchema = new Schema({
    user_id :  { type: Schema.Types.ObjectId, ref: 'User', required:true },

    question_id:{ type: Schema.Types.ObjectId, ref: 'Question', required:true },

    answer_id:{ type: Schema.Types.ObjectId, ref: 'Answer', required:true },

    is_correct:{
        type:Boolean,
        required:true
    }
},
{
    timestamps:true
})

const Answers = Mongoose.model('UserAnswer',answerSchema);

module.exports = Answers;