const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require ('dotenv').config();




// Signup api

router.post('/signup',(req,res) =>{
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length <=0){
                query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err,results)=>{
                    if(!err){
                        return res.status(200).json({message:"successfully registered"});
                    }
                    else{
                        return res.status(500).json(err);
                    }
                })
            }
           else {
                return res.status(400).json({message: "Email da ton tai"});
           }
        }
        else{
        return res.status(500).json(err);
        } 
    })
});

// Login api

router.post('/login',(req, res)=>{
    const user = req.body;
    query ="select email,password,role,status from user where email=?";
    connection.query(query,[user.email],(err, results)=>{
        if(!err){
            if (results.length <=0 || results[0].password !=user.password){
                return res.status(401).json({message:"Incorrect Username or Password"});
            }
            else if(results[0].status === 'false'){
                return res.status(401).json({message:"Wait for Admin Approval"});
            }
            else if(results[0].password == user.password){
                const response = { email: results[0].email, role: results[0].role}
                const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn: '8h'})
                res.status(200).json({token:accessToken});
            }
            else{
                return res.status(400).json({message:"Something went wrong. Please try again later."});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

// Reset Password

router.post('/forgotPassword',(req, res) => {
    const user = req.body;
    query = "select email,password from user where email=?";
    connection.query(query,[user.email],(err,results) => {
        if(!err) {
            if(results.length <= 0) {
                return res.status(200).json({message:"Password sent successfully to your email."});
            }
            else{
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by Cafe Management System',
                    html:'<p><b>Your Login details for Cafe Management System</b><br><b>Email: </b>'+results[0].email+'<br><b>Password: </b>'+results[0].password+'<br><a href="http://localhost:4200">Click here to login</a></p>'
                };
                transporter.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error);
                    }
                    else {
                        console.log('Email sent:'+info.response);
                    }
                });
                return res.status(200).json({message:"Password sent successfully to your email."});
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})













// Select api 

router.get('/get', (req, res)=>{
    var query = "select id,name,email,contactNumber,status from user where role = 'user'";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

// Update user

router.patch('/update', (req, res)=>{
    let user = req.body;
    var query ="update user set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows ==0){
                return res.status(404).json({message:"User id does not exist"});
            }
            return res.status(200).json({message:"User Update Successfully "});
        }
        else{
            return res.status(500).json(err);
        }

        })
    })

// Get token

    router.get('/checkToken',(req,res)=>{
        return res.status(200).json({message: "true"});
    })


// Change password api

router.post('/changePassword',(req,res)=>{
    //const
})



module.exports = router;