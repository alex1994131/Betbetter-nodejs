const express = require('express');
// const jwt = require('jsonwebtoken');
// const ObjectId = require('mongoose').Types.ObjectId;

// const Article = require('../models/articlesModel.js');
const config = require('../config.js');

let router = express.Router();

router.post('/bookmarks', (req, res) => {
    var sql = "select * from `bookmark`";

    config.connection.query(sql, function(err, results){    
        if(results&&results.length>0){
            res.json({ bookmarks: results });
        }
        else{
            res.json({ status: false, errors: 'no records'});
        }
                
    });
});

router.post('/sports', (req, res) => {
    var sql = "select * from `sports`";

    config.connection.query(sql, function(err, results){    
        if(results&&results.length>0){
            res.json({ sports: results });
        }
        else{
            res.json({ status: false, errors: 'no records'});
        }         
    });
});



module.exports = router;
