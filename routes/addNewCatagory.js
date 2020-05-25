var express = require('express');
var router = express.Router();
var bcrypt=require('bcryptjs');
var userModule=require('../modules/user');
var passCatModel =require('../modules/password_category');
var passModel=require('../modules/add_password');
var jwt = require('jsonwebtoken');
const {check,validationResult} = require('express-validator');
var getPassCat=passCatModel.find({});
var getAllPass=passModel.find({});

/* GET home page. */

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkLoginUser(req,res,next){
   var userToken=localStorage.getItem('userToken');
  try{
    var decoded=jwt.verify(userToken,'loginToken');
  }catch(err){
    res.redirect('/');
  }
  next();
}

function checkEmail(req,res,next){
  var email=req.body.email;
  var checkExistEmail=userModule.findOne({email:email});
  checkExistEmail.exec((err,data)=>{
    if (err) throw err;
    if(data){
   return res.render('signup', { title: 'Password Managment System',msg:'Email Already Exist' });

    }
    next();
  });
}

function checkUserName(req,res,next){
  var uname=req.body.uname;
  var checkExistName=userModule.findOne({username:uname});
  checkExistName.exec((err,data)=>{
    if (err) throw err;
    if(data){
   return res.render('signup', { title: 'Password Managment System',msg:'Username Already Exist' });

    }
    next();
  });
}

router.get('/',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    res.render('addNewCatagory', { title: 'Password Managment System',loginUser: loginUser,errors:'',success:''  });
  });

router.post('/',checkLoginUser,[check('passwordCatagory','Enter Password Category Name').isLength({min:1})], function(req, res, next) {

  var loginUser=localStorage.getItem('loginUser');
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.mapped());
    res.render('addNewCatagory', { title: 'Password Managment System',loginUser: loginUser,errors:errors.mapped(),success:'' });
  }
  else{
    var passCatName = req.body.passwordCatagory;
    var passCatDetails = new passCatModel({
      password_category:passCatName
    });
    passCatDetails.save(function(err,doc){
      if(err) throw err;
    res.render('addNewCatagory', { title: 'Password Managment System',loginUser: loginUser,errors:'',success:'Password Category Inserted Successfully' });
    })
  }
});

module.exports = router;
