const  Mongoose  = require("mongoose");
const Schema = Mongoose.Schema;

const userSchema = new Schema({
    email: { 
        type: String,
        required: true,
        match: /.+\@.+\..+/,
      }
},
{
    timestamps:true
})

const User = Mongoose.model('User',userSchema);

module.exports = User;