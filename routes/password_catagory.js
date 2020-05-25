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
    getPassCat.exec(function(err,data){
      if(err) throw err;
    res.render('password_catagory', { title: 'Password Managment System',loginUser: loginUser,records:data });
  });
  });

  router.get('/delete/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passcat_id=req.params.id;
    console.log(passcat_id);
    var passdelete = passCatModel.findByIdAndDelete(passcat_id);
    passdelete.exec(function(err,data){
      if(err) throw err;
      res.redirect('/password_catagory')
    });
  });
  
  router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passcat_id=req.params.id;
    console.log(passcat_id);
    var getpasscategory = passCatModel.findById(passcat_id);
    getpasscategory.exec(function(err,data){
      if(err) throw err;
      res.render('edit_pass_cat', { title: 'Password Managment System',loginUser: loginUser,errors:'',success:'',records:data,id:passcat_id });
  
    });
  });
  
  router.post('/edit/',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passcat_id=req.body.id;
    var passwordCatagory=req.body.passwordCatagory;
    var update_passCat=passCatModel.findByIdAndUpdate(passcat_id,{password_category:passwordCatagory});
    console.log(passcat_id);
    var getpasscategory = passCatModel.findById(passcat_id);
    update_passCat.exec(function(err,doc){
      if(err) throw err;
      res.redirect('/password_catagory');
    });
  });

module.exports = router;
