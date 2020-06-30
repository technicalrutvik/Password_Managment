var express=require('express');
var router=express.Router();
const mongoose=require('mongoose');
var productModel=require('../modules/products');
var multer=require('multer');
var checkAuth=require('./middleware/auth');
const productsController=require('./controller/products');


var storage=multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'./public/uploads/')
	},
	filename:function(req,file,cb){
		cb(null, Date.now()+file.originalname)
	}
})
var upload=multer({storage:storage});
router.get('/',function(req,res,next){
	res.json({
		message:"success"
	})
})

router.get('/getAllProducts',checkAuth,productsController.getAllProducts)

router.post('/add',upload.single('productImage'),checkAuth,productsController.addProducts);
module.exports=router;

// function(req,res,next){
	
// 	console.log(req.userData);
// 	// console.log(req.file);

// 	var product_name=req.body.name;
// 	var price=req.body.price;
// 	var quantity=req.body.quantity;

// 	var productDetails=new productModel({
// 		_id:mongoose.Types.ObjectId(),
// 		product_name:product_name,
// 		price:price,
// 		quantity:quantity,
// 		image:req.file.path
// 	});
// 	productDetails.save()
// 	.then(data=>{
// 		res.status(201).json({
// 			message:"Product Inserted Successfully",
// 			result:data
// 		})
// 	})
// 	.catch(error=>{
// 		res.json(error);
// 	})
// }