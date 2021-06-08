const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/usersModel.js');
const config = require('../config');

const router = express.Router();

// Check if E-mail is Valid or not
const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const checkUserUniqueness = (field, value) => {
    console.log(filed);
    console.log(value);
    var sql = "select * from `user` where `"+ field +"`= '" + value+ "'";
    config.connection.query(sql, function(err, results){
        console.log(results); 
        let res={};   
        if(results&&results.length>0){
            res = { error: { [field]: "This " + field + " is not available" }, isUnique: false };
        }
        else{
            res = { error: { [field]: "" }, isUnique: true };
        }
        return res;           
     });   
}

router.post('/validate', async (req, res) => {
    const { field, value } = req.body;
    const { error, isUnique } = await checkUserUniqueness(field, value);

    if (isUnique) {
        res.json({ success: 'success' });
    } else {
        res.json({ error });
    }
});

router.post('/signup', (req, res) => {
    const name = req.body.name || '';
    const username = req.body.user || '';
    const email = req.body.email || '';
    const password = req.body.password || '';
    const confirmPassword = req.body.c_password || '';
    const reqBody = { name, username, email, password, confirmPassword };
    let passwords="";
    var errors = {};
    var flag=true;
    Object.keys(reqBody).forEach(async field => {
        console.log(reqBody[field]);
        console.log(field);
        if (reqBody[field] === '') {
            errors = {...errors, [field]:"This "+ field +" is required"}
        }
        if (field === 'username' || field === 'email') {
            const value = reqBody[field];
            var sql = "select * from `user` where `"+ field +"`= '" + value+ "'";
            config.connection.query(sql, function(err, results){
                let res={};   
                if(results.length>0){
                    flag=false;
                    res = { error: "This " + field + " is not available" , isUnique: false };             
                }          
             });
            if (!flag) {
                errors = {...errors, [field]:"This " + field + " is not available"};
                flag=true;
            }    
        }
        config.connection.commit();
        if (field === 'email' && !validateEmail(reqBody[field])) {
            errors = {...errors, [field]: 'Not a valid Email'}
        }
        if (field === 'confirmPassword' && reqBody[field] !== reqBody['password']) {
            errors = {...errors, [field]: 'Passwords do not match'}
        }
    });
    
    if (Object.keys(errors).length > 0) {
        res.json({ errors });
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) return err;
            // Create the hashed password
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) return err;
                var sql="INSERT INTO `user` (name, username, email, password) VALUES ('"+name+"' , '"+username+"' , '"+email+"' , '"+hash+"')";
                config.connection.query(sql, function(err, results){  
                    res.json({ Status:true });
                 });  
            });
        });
             
    }
});

router.post('/login', (req, res) => {
    const email = req.body.email || '';
    const password = req.body.password || '';

    let errors = {};

    if (email === '') {
        errors = {...errors, email: 'This field is required' };
    }
    if (password === '') {
        errors = {...errors, password: 'This field is required' };
    }

    if (Object.keys(errors).length > 0) {
        res.json({ errors });
    } else {
        var sql = "select * from `user` where `email` = '"+ email +"'";
        config.connection.query(sql, function(err, results){    
            if(results&&results.length>0){
                bcrypt.compare(password, results[0].password, (err, isMatch) => {
                    if (err) return err;
                    if (isMatch) {
                        var end_time=new Date(results[0].To_date)
                        var c_time=new Date();
                        c_time.setDate(c_time.getDate() + results[0].freeze);
                        let pay_role=false;
                        if(c_time>end_time){
                            end_time=c_time
                        }
                        const current_date=new Date();
                        if (end_time>current_date){
                            pay_role=true;
                            console.log(pay_role)
                        }
                        console.log(end_time)
                        const token = jwt.sign({
                            id: results[0].id,
                            role:results[0].Role,
                            username: results[0].username,
                            email:results[0].email,
                            password:results[0].password,
                            limitdate:pay_role,
                            Ending:end_time,
                            freeze:results[0].freeze,
                        }, config.jwtSecret);
                        res.json({ status: true, token })
                    }
                });
            }
            else{
                res.json({ status: false, errors: 'Invalid Username or Password'});
            }
                    
        });
    }
});

router.post('/update', async (req, res) => {
    console.log(req.body)
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) return err;
            var sql = "UPDATE `user` SET username ='"+ req.body.user+"', email='"+req.body.email+"', password='"+hash+"' WHERE id = '"+req.body.id+"'";
            config.connection.query(sql, function(err, results){  
                res.json({ tatus:true });
            });  
        });
    });
});

router.post('/updatefreeze', async (req, res) => {
    console.log(req.body)
    if(req.body.freeze==0){
        var sql = "UPDATE `user` SET To_date='"+req.body.end_time+"' WHERE id = '"+req.body.id+"'";
    }
    else{
        var sql = "UPDATE `user` SET freeze='"+0+"' , To_date='"+req.body.end_time+"' WHERE id = '"+req.body.id+"'";
    } 
    console.log(sql)
    config.connection.query(sql, function(err, results){  
        res.json({ status:true });
    });        
});
module.exports = router;
