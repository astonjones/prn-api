const express = require('express');
const router = express.Router();
const dbo = require('../db/conn'); //DB connection
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;

router.get('/', function(req, res){
    res.status(400).send("Bad Request. You do not have access.");
})

router.post('/leadData', function(req, res){
if(req.body.google_key == GOOGLE_SECRET){

    //NEED TO PUSH DATA TO VICI DB HERE

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
} else {
    res.status(400).send("Incorrect Authorization");
}

});

module.exports = router;