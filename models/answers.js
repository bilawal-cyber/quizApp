const  Mongoose  = require("mongoose");
const Schema = Mongoose.Schema;

const answerSchema = new Schema({
    option : {
        type: String,
        required : true,
     },
    is_correct:{
        type:Boolean,
        default: false,
        required:true
    },
    is_active:{
        type:Boolean,
        default:true
    }

    

},
{
    timestamps:true
})

const Answers = Mongoose.model('Answer',answerSchema);

module.exports = Answers;