const mongoose=require('mongoose');
require('dotenv').config()
var dburl=process.env.MONGO_DB_URL;
mongoose.connect(dburl,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true });
var conn=mongoose.Collection;
var schema
var mongoosePaginate=require('mongoose-paginate');

var passSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    password_category:{
        type:mongoose.Schema.Types.ObjectId,ref:'password_categories',
        required:true,
    },
    user_id:{
        type:String,
        required:true
    },
    project_name:{
        type:String,
        required:true,
    },

    password_details:{
        type:String,
        required:true,
    },

    date:{
        type:Date,
        default:Date.now()  
    }
});
   
 passSchema.plugin(mongoosePaginate);
var passModel=mongoose.model('add-password',passSchema);
module.exports=passModel;