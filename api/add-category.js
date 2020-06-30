var express =require('express');
var router=express.Router();
var passModel=require('../modules/add_password');
var passCatModel =require('../modules/password_category');
var getPassCat=passCatModel.find({},{'password_category':1,'_id':1});
const mongoose=require('mongoose');

var checkAuth=require('./middleware/auth');
const categoryController=require('./controller/category');



router.get("/get-category/:userid",checkAuth,categoryController.getCategory);

router.post("/add-category/",checkAuth,categoryController.addCategory);

router.put("/add-update-category/:id",categoryController.addUpdateCategory);

router.patch("/update-category/",checkAuth,categoryController.updateCategory);

router.delete("/delete-category/",checkAuth,categoryController.deleteController);

router.post('/add-new-password/',function(req,res,next){
	var passCategory=req.body.password_category;
	var projectName=req.body.project_name;
	var password_details=req.body.password_details;

	var passDetails=new passModel({
		_id:mongoose.Types.ObjectId(),
		password_category:passCategory,
		project_name:projectName,
		password_details:password_details
	});
	passDetails.save()
	.then(data=>{
		res.status(201).json({
			message:"Password Inserted Successfully",
			result:data
		})
	})
	.catch(err=>{
		res.json(err);
	})
})

router.get('/get-all-password',function(req,res,next){
	passModel
	.find()
	.select("_id password_category project_name password_details ")
	.populate("password_category","password_category")
	.exec()
	.then(data=>{
		res.status(201).json({
			message:"OK",
			result:data
		})
	})
	.catch(err=>{
		res.json(err);
	})
})

router.get('/getPasswordById/:id',function(req,res,next){
	var id=req.params.id;
	passModel.findById(id)
	.select("_id password_category project_name password_details ")
	.populate("password_category","password_category")
	.exec()
	.then(data=>{
		res.status(201).json({
			message:"OK",
			result:data
		})
	})
	.catch(err=>{
		res.json(err);
	})
})

router.delete('/delete-password',function(req,res,next){
	var password_id=require.body.password_id;
	passModel.findByIdAndRemove(password_id)
	.then(data=>{
		res.status(201).json({
			message:"Password Deleted Successfully",
			result:data
		})
	})
	.catch(err=>{
		res.json(err);
	})
})
 
module.exports=router;