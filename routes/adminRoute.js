const express = require('express');
// const jwt = require('jsonwebtoken');
// const ObjectId = require('mongoose').Types.ObjectId;

// const Article = require('../models/articlesModel.js');
const config = require('../config.js');

let router = express.Router();

router.post('/users', (req, res) => {
    var sql = "select * from `user`";

    config.connection.query(sql, function(err, results){    
        if(results&&results.length>0){
            res.json({ users: results });
        }
        else{
            res.json({ status: false, errors: 'no records'});
        }
                
    });
});

router.post('/deluser', (req, res) => {
    console.log(req)
    var sql = "DELETE FROM `user` WHERE id = '"+req.body.id+"'";
    console.log(sql);
    config.connection.query(sql, function(err, results){    
        var sql = "select * from `user`";
        config.connection.query(sql, function(err, results){    
            if(results&&results.length>0){
                res.json({ users: results });
            }
            else{
                res.json({ status: false, errors: 'no records'});
            }            
        });          
    });
});

router.post('/client', (req, res) => {
    console.log(req)
    var sql = "UPDATE `Account` SET client_id ='"+ req.body.id+"', password= '"+req.body.secret+"' WHERE id = '0'";
    console.log(sql);
    config.connection.query(sql, function(err, results){    
            res.json({ status: 'true' });            
    });
});


router.post('/getAccount', (req, res) => {
    console.log("sdsd")
    var sql = "select * from `client` where id='0'";
    config.connection.query(sql, function(err, results){    
        if(results&&results.length>0){
            res.json({ clientData: results });
        }
        else{
            res.json({ status: false, errors: 'no records'});
        }
                
    });
});

router.post('/payments', (req, res) => {
    var sql = "select * from `payment`";

    config.connection.query(sql, function(err, results){    
        if(results&&results.length>0){
            res.json({ payments: results });
        }
        else{
            res.json({ status: false, errors: 'no records'});
        }
                
    });
});

// router.post('/setfilter', (req, res) => {
//     console.log("sdsd")
//     var sql="INSERT INTO `filter` (filter_name, filter_id) VALUES ('"+req.body.filter_name+"' , '"+req.body.filter_id+"')";
//     config.connection.query(sql, function(err, results){    
//         var sql = "select * from `filter`";
//         config.connection.query(sql, function(err, results){    
//             if(results&&results.length>0){
//                 res.json({ filters: results });
//             }
//             else{
//                 res.json({ status: false, errors: 'no records'});
//             }           
//         });                
//     });
// });

router.post('/setfilter', (req, res) => {
    
    var sql="Update `filter` SET filter_name = '"+ req.body.filter_name +"', filter_id ='"+ req.body.filter_id +"' WHERE id = '"+ req.body.filter_no +"'";

    config.connection.query(sql, function(err, results){    
        var sql = "select * from `filter`";
        config.connection.query(sql, function(err, results){    
            if(results&&results.length>0){
                res.json({ filters: results });
            }
            else{
                res.json({ status: false, errors: 'no records'});
            }           
        });                
    });
});

router.post('/filters', (req, res) => {
    var sql = "select * from `filter`";
    config.connection.query(sql, function(err, results){ 
        if(results&&results.length>0){
            res.json({ filters: results });
        }
        else{
            res.json({ status: false, errors: 'no records'});
        }
                
    });
});

router.post('/Updatefilter', (req, res) => {
    if(req.body.filter_id===''){
        var sql="INSERT INTO `filter` (user_id,filter_name,bookmark_id,sports_id) VALUES ('"+req.body.user_id+"','"+req.body.filtername+"','"+req.body.bookmarks+"' , '"+req.body.sports+"')";    
    }
    else{
        var sql = "UPDATE `filter` SET user_id ='"+ req.body.user_id+"', bookmark_id='"+req.body.bookmarks+"', sports_id='"+req.body.sports+"', filter_name='"+req.body.filtername+"' ,filter_id='' ,active='0' WHERE id = '"+req.body.filter_id+"'";
    }
    config.connection.query(sql, function(err, results){ 
        res.json({ status: true, errors: 'no records'});
                
    });
});

router.post('/delfilter', (req, res) => {
   
    var sql = "DELETE FROM `filter` WHERE id = '"+req.body.id+"'";
    config.connection.query(sql, function(err, results){ 
        var sql = "select * from `filter`";
        config.connection.query(sql, function(err, results){    
            if(results&&results.length>0){
                res.json({ filters: results });
            }
            else{
                res.json({ status: false, errors: 'no records'});
            }           
        });                
    });
});



router.post('/price', (req, res) => {
    var sql = "UPDATE `membership` SET price ='"+ req.body.price+"' WHERE id = '0'";
    config.connection.query(sql, function(err, results){ 
        var sql = "select * from `membership`";
        config.connection.query(sql, function(err, results){ 
        if(results&&results.length>0){
            res.json({ price: results });
        }
        else{
            res.json({ status: false, errors: 'no records'});
        }        
        });            
    });
});

router.post('/getprice', (req, res) => {
    var sql = "select * from `membership`";
    config.connection.query(sql, function(err, results){ 
        if(results&&results.length>0){
            res.json({ price: results });
        }
        else{
            res.json({ status: false, errors: 'no records'});
        }
                
    });
});

router.post('/delfilter', (req, res) => {
   
    var sql = "DELETE FROM `filter` WHERE id = '"+req.body.id+"'";
    config.connection.query(sql, function(err, results){ 
        var sql = "select * from `filter`";
        config.connection.query(sql, function(err, results){    
            if(results&&results.length>0){
                res.json({ filters: results });
            }
            else{
                res.json({ status: false, errors: 'no records'});
            }           
        });                
    });
});

router.post('/filteractive', (req, res) => {
    console.log(req)
    var query = "select * from `filter` where id = '"+req.body.id+"'";
    config.connection.query(query, function(err, results){
        if(results) {
            active = results[0].active;
            if(active == 1) {
                active = 0;
            }
            else {
                active = 1;
            }

            var sql = "Update `filter` set active = '"+ active +"' WHERE id = '"+req.body.id+"'";
            config.connection.query(sql, function(err, results){    
                var sql = "select * from `filter`";
                config.connection.query(sql, function(err, results){    
                    if(results&&results.length>0){
                        res.json({ filters: results });
                    }
                    else{
                        res.json({ status: false, errors: 'no records'});
                    }           
                });           
            });
        }
    });
});

router.post('/updateFreeze', (req, res) => {
   console.log(req.body)
    var sql = "UPDATE `user` SET freeze ='"+ req.body.freeze_day+"' WHERE id = '"+req.body.id+"'";
    config.connection.query(sql, function(err, results){ 
        if(results&&results.length>0){
            res.json({ status:true });
        }
        else{
            res.json({ status: false, errors: 'no records'});
        }        
    });
});

module.exports = router;
