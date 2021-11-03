const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.send("Google api endpoints!");
})

router.post('/leadData', function(req, res){
    console.log(`Google lead data: ${req.body}`);
});

module.exports = router;