var passModel=require('../../modules/add_password');
const mongoose=require('mongoose');
var passCatModel =require('../../modules/password_category');
 
exports.getCategory=function(req,res,next){
		/*getPassCat.exec(function(err,data){
      if(err) throw err;
    	// res.send(data);
    	res.status(201).json({
    		message:"success",
    		result:data
    	})
	});*/
	var id=req.params.userid;
	var getPassCat=passCatModel.find({user_id:id},{'password_category':1,'_id':1});

	getPassCat.exec()
	.then(data=>{
		res.status(201).json({
    		message:"Ok",
    		result:data
    	})
	})
	.catch(err=>{
		res.json(err);
	})
}

exports.addCategory=function(req,res,next){
	var passcategory=req.body.passwordCategory;
	var user_id=req.body.user_id;
	var passCatDetails=new passCatModel({password_category:passcategory,user_id:user_id});
	/*passCatDetails.save(function(err,data){
		// if(err) throw err;
		// res.send(data);
		res.status(201).json({	
			message:"Category Inserted Successfully",
			result:data
		})
	})*/
	passCatDetails.save()
	.then(data=>{
		res.status(201).json({
			message:"Category Inserted Successfully",
			result:data
		})
	}).catch(error=>{
		res.json(error);
	})
}

exports.addUpdateCategory=function(req,res,next){

	var id=req.params.id;
	var passCategory=req.body.passwordCatagory;
	passCatModel.findById(id,function(err,data){
	data.password_category=passCategory?passCategory:data.password_category;
	/*data.save(function(err,data){
		// if(err) throw err;
		// res.send("Node Js update RestFul Api put");		
		res.status(201).json({
			message:"Category updated Successfully",
			result:data
		})
	})*/

	data.save()
	.then(data=>{
		res.status(201).json({
			message:"Category updated Successfully",
			result:data
		})
	})
	.catch(err=>{
		res.json(err)
	})

	})
}

exports.updateCategory=function(req,res,next){
	var id=req.body._id;
	var passCategory=req.body.passwordCategory;
	passCatModel.findById(id,function(err,data){
	data.password_category=passCategory?passCategory:data.password_category;
	/*data.save(function(err){
		if(err) throw err;
		res.send("Node Js update RestFul Api patch");		
	})*/
	data.save()
	.then(data=>{
		res.status(201).json({
			message:"Category updated Successfully",
			result:data
		})
	})
	.catch(err=>{
		res.json(err)
	})
	})
}

exports.deleteController=function(req,res,next){
	var cat_id=req.body.cat_id;
	/*passCatModel.findByIdAndRemove(cat_id,function(err){
		if(err) throw err;
	res.send("Node Js RestFul Api delete");		
	})*/
	passCatModel.findByIdAndRemove(cat_id)
	.then(data=>{
		res.status(201).json({
			message:"Category Deleted Successfully",
			result:data
		})
	})
	.catch(err=>{
		res.json(err)
	})
}