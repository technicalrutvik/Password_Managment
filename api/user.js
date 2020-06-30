var express=require('express');
var router=express.Router();
var checkAuth=require('./middleware/auth');
var multer=require('multer');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
var userModel=require('../modules/user');
var jwt=require('jsonwebtoken');

var storage=multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'./public/uploads/')
	},
	filename:function(req,file,cb){
		cb(null, Date.now()+file.originalname)
	}
})
var upload=multer({storage:storage});
	
router.post('/login',function(req,res,next){

	var username=req.body.username;
	var password=req.body.password;

	userModel.find({username:username})
	.exec()
	.then(user=>{

		if(user.length<1){
			res.status(404).json({
			message:"Auth Failed username",
			})
		}
		else{

			bcrypt.compare(req.body.password,user[0].password,function(err,result){
				if(err) {
				res.json({
					message:"Auth Failed password",
				})
				}
				if(result){

				var token=jwt.sign({
						username:user[0].username,
						userId:user[0]._id
					},
					'secret',
					{
						expiresIn:"8h"
					}
					);

					res.status(200).json({
						message:"User Found",
						token:token 
					})
				}
				else{
					res.json({
						message:"Auth Failed not exist",
						
					})
				}
			});

		}
	})
	.catch(err=>{
		res.json({
			error:err
			});
	})
});
router.post('/signup',function(req,res,next){

	var username=req.body.username;
	var email=req.body.email;
	var password=req.body.password;
	var cpassword=req.body.cpassword;

	if(password!==cpassword){
			res.json({
				message:"password not matched",
			})
	}
	else{	

		bcrypt.hash(password,10,function(err,hash){
		// if(err){	
		// 	return res.json({
		// 		message:"Something Went Wrong!",
		// 		error:err	
		// 	})	}
		// else{
			if(err) throw err;
				var userDetails=new userModel({
				_id:mongoose.Types.ObjectId(),
				username:username,
				email:email,
				password:hash
				
			});
			userDetails.save()
			.then(data=>{
				res.status(201).json({
					message:"User Registered Successfully",
					result:data
				})
			})
			.catch(error=>{
				res.json(error);
			})
		// }
		

		})

	
		}
});

router.get("/getUserDetails/:userid",checkAuth,function(req,res,next){

	var id=req.params.userid;
	var getUserDetails=userModel.find({_id:id},{'email':1,'profileImage':1});

	getUserDetails.exec()
	.then(data=>{
		res.status(201).json({
    		message:"Ok",
    		result:data
    	})
	})
	.catch(err=>{
		res.json(err);
	})
});


router.post("/updateProfile/",upload.single('profileImage'),function(req,res,next){
	var id=req.body.user_id;
	var profilePic=req.file.path;

	userModel.findById(id,function(err,data){
	data.profileImage=profilePic?profilePic:data.profileImage;
	/*data.save(function(err){
		if(err) throw err;
		res.send("Node Js update RestFul Api patch");		
	})*/
	data.save()
	.then(data=>{
		res.status(201).json({
			message:"Profile Image Updated Successfully",
			result:data
		})
	})
	.catch(err=>{
		res.json(err)
	})
	})
});



module.exports=router;
