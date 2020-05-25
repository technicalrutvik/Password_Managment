const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true });
var conn=mongoose.Collection;
var schema
var mongoosePaginate=require('mongoose-paginate');

var passSchema = new mongoose.Schema({
    password_category:{
        type:String,
        required:true,
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
var passModel=mongoose.model('password_deatails',passSchema);
module.exports=passModel;