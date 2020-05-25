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
    
   
        var options = {
       
          offset:   1,
          limit:    1
        };
  
        passModel.paginate({},options).then(function(result){
 
     
    res.render('view-all-password', { title: 'Password Managment System', records: result.docs ,
      current: result.offset,
      pages: Math.ceil(result.total / result.limit),
     loginUser: loginUser });
    });      
  });
  
  router.get('/:page',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    
    var perPage = 1;
        var page = req.params.page || 1;
  
    getAllPass.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err,data){
     
      if(err) throw err;
      passModel.countDocuments({}).exec((err,count)=>{ 
    res.render('view-all-password', { title: 'Password Managment System', records: data,
      current: page,
      pages: Math.ceil(count / perPage),
     loginUser: loginUser });
    });
  });
  });
  module.exports = router;

  
