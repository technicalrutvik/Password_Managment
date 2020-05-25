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
  res.redirect('/dashboard');
});

router.get('/edit/:id',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var id=req.params.id;
  var getPassDetails=passModel.findById({_id:id});
  getPassDetails.exec(function(err,data){
    if(err) throw err;
    getPassCat.exec(function(err,data1){
  res.render('edit_password_details', { title: 'Password Managment System',loginUser: loginUser,record:data,records:data1,success:'' });
  });
});
});

router.post('/edit/:id',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var id=req.params.id;
  var passcat=req.body.pass_cat;
  var project_name=req.body.project_name;
  var pass_details=req.body.pass_details;
  passModel.findByIdAndUpdate(id,{password_category:passcat,project_name:project_name,password_details:pass_details }).exec(function(err){
    if(err) throw err;
  var getPassDetails=passModel.findById({_id:id});
  getPassDetails.exec(function(err,data){
    if(err) throw err;
    getPassCat.exec(function(err,data1){
  res.render('edit_password_details', { title: 'Password Managment System',loginUser: loginUser,record:data,records:data1,success:'Password Updated Successfully' });
  });
});
});
});

router.get('/delete/:id',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var id=req.params.id;

  var id=req.params.id;

  var passdelete = passModel.findByIdAndDelete(id);
  passdelete.exec(function(err,data){
    if(err) throw err;
    res.redirect('/view-all-password/');
  });
});
     
  module.exports = router;

  
