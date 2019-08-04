//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session =require('express-session');
const passport =require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//const bcrypt = require('bcrypt');
//const md5 = require('md5'); //securing password with md5

//const encrypt = require('mongoose-encryption'); //using mongoose encryption to secure pass word



//console.log(process.env.API_KEY);
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.use(session({
    secret: "giftedbriaintech",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://test:test@cluster0-t9vby.mongodb.net/students",{useNewUrlParser: true}); //connecting to local mongodb server
mongoose.set('useCreateIndex',true);

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    phone: String,
    password: String
   
});

userSchema.plugin(passportLocalMongoose);


//userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']}); //applying mongoose encryption to password
const student = new mongoose.model('Student',userSchema);

passport.use(student.createStrategy());
passport.serializeUser(student.serializeUser());
passport.deserializeUser(student.deserializeUser());


app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/about',(req,res)=>{
res.render('about');
});

app.get('/contact',(req,res)=>{
    res.render('contact');
    });
app.get('/login',(req,res)=>{
        res.render('login');
    });
    

app.get('/student',(req,res)=>{
        res.render("signup");
    });
app.get('/success',(req,res)=>{
    
            if(req.isAuthenticated()){
                let fullname=found.fullname;
                res.render('success',{fullname: fullname});
    
            }else{
                res.redirect('/login');
            }  
    });

 

 app.post('/student',(req,res)=>{
        student.register({username: req.body.email, fullname: req.body.fullname, email: req.body.email, phone: req.body.phone}, req.body.password, (err,user)=>{
            if(err){
                console.log(err);
                res.redirect('/student');
            }else{
               let fullname=user.fullname;
                res.render('success',{fullname: fullname});
            }
        });
    });
    
 app.post('/login', (req,res)=>{
    const user = new student({
        username: req.body.email,
        password: req.body.password
      });
    
      req.login(user, function(err){
        if (err) {
          console.log(err);
        } else {
          let fullname= user.fullname;
            //res.render('success',{fullname: fullname});
            
            res.render('success',{fullname:fullname});
        }
      });

    });

    const port= process.env.PORT || 3000;

app.listen(port,()=>{
    console.log('server running on '+ port);

});

