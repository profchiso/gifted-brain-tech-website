//jshint esversion:6

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');

const port= process.env.PORT || 3000;


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
const secret= 'giftedbraintechnologies';
userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']});
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
        res.render('success');

    });

    app.post('/student',(req,res)=>{

        const newStudent= new student({
             fullname:  req.body.fullname,
             email : req.body.email,
             phone: req.body.phone,
             password:req.body.password

        });
        newStudent.save((err)=>{
            if(err){
                console.log(err);

            }else{
                res.render('success');
            }
        });

    });
    app.get('/login',(req,res)=>{
        res.render('login');
    });
    app.post('/login',(req,res)=>{
        let username= req.body.email;
        let password= req.body.password;
        student.findOne({email:username},(err,found)=>{
            if(err){
                console.log(err);
            }else{
                if(found){
                    if(found.password===password){
                        res.render('success');
                    }else{
                        res.render('login');
                    }
                }
            }
        });
    });

app.listen(port,()=>{
    console.log('server running on '+ port);

});

