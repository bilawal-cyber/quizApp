const  Mongoose  = require("mongoose");
const Schema = Mongoose.Schema;

const questionSchema = new Schema({
    type : { 
        type: String,
        required: true,
      },
    question : {
        type: String,
        required: true,
    },
    correct_answer : {
        type: String,
        default:null,
    },
    answers:[
        { type: Schema.Types.ObjectId, ref: 'Answer', required:true }
    ]
},
{
    timestamps:true
})

const Questions = Mongoose.model('Question',questionSchema);

module.exports = Questions;