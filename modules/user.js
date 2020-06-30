const mongoose=require('mongoose');
require('dotenv').config()
var dburl=process.env.MONGO_DB_URL;
mongoose.connect(dburl,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true });
// mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true });
var conn=mongoose.Collection;

var userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:{
        type:String,
        required:true,
        // index:{
        //     unique:true,
        // }
    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true,
        },
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()  
    }
});

var userModel=mongoose.model('user',userSchema);
module.exports=userModel;