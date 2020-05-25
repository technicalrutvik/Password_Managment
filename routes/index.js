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

router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }
  else{
    res.render('index', { title: 'Password Managment System',msg:'' });
  }
});

router.post('/', function(req, res, next) {
  var username=req.body.uname;
  var password=req.body.password;
  var checkUser=userModule.findOne({username:username});
  checkUser.exec((err,data)=>{
    if(err) throw err;

    var getUserId=data._id;
    var getPassword=data.password;

    if(bcrypt.compareSync(password,getPassword)){
      var token = jwt.sign({userID:getUserId},'loginToken');
      localStorage.setItem('userToken',token);
      localStorage.setItem('loginUser',username);
      res.redirect('/dashboard'); 
      // res.render('index', { title: 'Password Managment System',msg:'User Login Successfully' });
    }
    else{
      res.render('index', { title: 'Password Managment System',msg:'Invalid Username and Password.' });
    }

  })
});


router.get('/signup', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }
  else{
  res.render('signup', { title: 'Password Managment System',msg:'' });
  }
});

router.post('/signup',checkUserName ,checkEmail,function(req, res, next) {
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;
  var bcrypt = require('bcryptjs');
  if(password!=confpassword){
  res.render('signup', { title: 'Password Managment System',msg:'Password not Matched' });
  }
  else{
    password=bcrypt.hashSync(req.body.password,10)
  var userDetails = new userModule({
    username:username,
    email:email,
    password:password
  });

  userDetails.save((err,doc)=>{
    if(err) throw err;
  res.render('signup', { title: 'Password Managment System',msg:'User Registered Successfully' });

  });
  }
});

















// router.get('/view-all-password',checkLoginUser, function(req, res, next) {
//   var loginUser=localStorage.getItem('loginUser');
  
//   var perPage = 1;
//       var page = req.params.page || 1;

//   getAllPass.skip((perPage * page) - perPage)
//   .limit(perPage).exec(function(err,data){
   
//     if(err) throw err;
//     passModel.countDocuments({}).exec((err,count)=>{ 
//   res.render('view-all-password', { title: 'Password Managment System', records: data,
//     current: page,
//     pages: Math.ceil(count / perPage),
//    loginUser: loginUser });
//   });
// });
// });



/** 
router.get('/view-all-password/:page',checkLoginUser, function(req, res, next) {
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
*/



router.get('/password-details',checkLoginUser, function(req, res, next) {
  res.redirect('/dashboard');
});

router.get('/password-details/edit/:id',checkLoginUser, function(req, res, next) {
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

router.post('/password-details/edit/:id',checkLoginUser, function(req, res, next) {
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

router.get('/password-details/delete/:id',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var id=req.params.id;

  var id=req.params.id;

  var passdelete = passModel.findByIdAndDelete(id);
  passdelete.exec(function(err,data){
    if(err) throw err;
    res.redirect('/view-all-password/');
  });
});



router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});



module.exports = router;
