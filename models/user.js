const  Mongoose  = require("mongoose");
const Schema = Mongoose.Schema;

const userSchema = new Schema({
    email: { 
        type: String,
        required: true,
      },
    userAnwers:[
        {type: Schema.Types.ObjectId, ref: 'UserAnswer',}
    ],
    score:{
        type : String,
        default : null
    }
},
{
    timestamps:true
})

const User = Mongoose.model('User',userSchema);

module.exports = User;