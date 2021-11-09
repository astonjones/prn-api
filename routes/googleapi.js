const express = require('express');
const router = express.Router();

const dbo = require('../db/conn');

router.get('/', function(req, res){
    res.status(400).send("Bad Request. You do not have access.");
})

// Need to push the lead data to a DB and to VICI Dialer
router.post('/leadData', function(req, res){
const dbConnect = dbo.getDb().g_db; //get the google DB inside of Atlas Cluster

dbConnect
    .collection('google-leads')
    .insertOne(req.body, function (err, result){
        if(err) {
            res.status(400).send('Error inserting data into Atlas Cluster');
        } else {
            console.log(`Added a new record into Atlas Cluster From Google`);
            res.status(204).send();
        }
    });

    console.log(`Google lead data: ${req.body}`);
});

module.exports = router;