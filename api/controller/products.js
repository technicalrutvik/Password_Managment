var productModel=require('../../modules/products');
const mongoose=require('mongoose');

exports.getAllProducts=(req,res,next)=>{
	productModel
	.find()
	.select("product_name price quantity image")
	.exec()
	.then(data=>{
		res.status(201).json({
			message:"OK",
			result:data
		})
	})
	.catch(error=>{
		res.json(error);
	})
}

exports.addProducts=function(req,res,next){
	
	
	// console.log(req.file);

	var product_name=req.body.name;
	var price=req.body.price;
	var quantity=req.body.quantity;

	var productDetails=new productModel({
		_id:mongoose.Types.ObjectId(),
		product_name:product_name,
		price:price,
		quantity:quantity,
		image:req.file.path
	});
	productDetails.save()
	.then(data=>{
		res.status(201).json({
			message:"Product Inserted Successfully",
			result:data
		})
	})
	.catch(error=>{
		res.json(error);
	})
}