//jshint esversion:6
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
//const md5 = require('md5'); //securing password with md5

//const encrypt = require('mongoose-encryption'); //using mongoose encryption to secure pass word

const port= process.env.PORT || 3000;

//console.log(process.env.API_KEY);
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/giftedbraintechDB',{useNewUrlParser:true});
const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String
});

//userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']}); //applying mongoose encryption to password
const student = new mongoose.model('Student',userSchema);


app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/about',(req,res)=>{
res.render('about');
});

app.get('/contact',(req,res)=>{
    res.render('contact');
    });

    app.get('/student',(req,res)=>{
        res.render("signup");
    });

    app.get('/success',(req,res)=>{
        let success= "";
        res.render('success',{success:success});

    });

    app.post('/student',(req,res)=>{
        bcrypt.hash(req.body.password,10,(err,hash)=>{

            const newStudent= new student({
                fullname:  req.body.fullname,
                email : req.body.email,
                phone: req.body.phone,
               // password:md5(req.body.password) // securing with md5
                password:hash 
   
           });
           let success= req.body.fullname;
           newStudent.save((err)=>{
            if(err){
                console.log(err);

            }else{
                let status="your registration was successfull";
                res.render('success',{success:success,status:status});
            }
        });

        });
    });

    app.get('/login',(req,res)=>{
        let wrong="";
        let success= "";
        let status="";
        res.render('login',{wrong: wrong,success:success,status:status});
    });

    app.post('/login',(req,res)=>{
        let username= req.body.email;
        let password= req.body.password;
        //let password= md5(req.body.password); //working with md5
        student.findOne({email:username},(err,found)=>{
            if(err){
                console.log(err);
            }else{
                if(found){
                    bcrypt.compare(password, found.password, function(err, result) {
                        if(result===true){
                            let success=found.fullname;
                            let status="Welcome to your dashboard";
                            res.render('success',{success:success,status:status});
                        }else{
                            res.render('login');
                        }
                    }); 
                }else{
                    let wrong="invalid credentials";
                    res.render('login',{wrong: wrong});
                }
            }
        });
    });

app.listen(port,()=>{
    console.log('server running on '+ port);

});

