const  Mongoose  = require("mongoose");
const Schema = Mongoose.Schema;

const answerSchema = new Schema({
    question_id:{ type: Schema.Types.ObjectId, ref: 'Question', required:true },

    selected:{ type: Schema.Types.ObjectId, ref: 'Answer', default:null },

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