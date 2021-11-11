const express = require('express');
const router = express.Router();
const https = require('https');
const dbo = require('../db/conn'); //DB connection
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const VICI_USER = process.env.VICI_USER;
const VICI_PASS = process.env.VICI_PASS;
const VICI_IP = process.env.VICI_IP;

router.get('/', function(req, res){
    res.status(400).send("Bad Request. You do not have access.");
})

router.post('/leadData', async function(req, res){
if(req.body.google_key == GOOGLE_SECRET){
    //url parameters to send with post request
<<<<<<< HEAD
    const params = {
=======
    const params  = JSON.stringify({
>>>>>>> d1be4f501f86cff292321225ae982eefc680449e
        phone_code: "1",
        list_id: "98769876", //ASSIGNED TO TEST LIST
        source: "This lead is coming from google ads.",
        function: "add_lead",
        user: "5004",
        pass: "agent5004",
        first_name: "",
        last_name: "",
        phone_number: ""
    });

    //options for https request
    const options = {
        hostname: `http://${VICI_IP}/vicidial/non_agent_api.php?`,
        port: 443,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    array = req.body.user_column_data;
    array.forEach(element => {
        //Parses the data from google into a viciDial data
        switch (element.column_id){
            case "FULL_NAME":
                var nameArr = element.string_value.split(' ');
                params.first_name = nameArr[0];
                params.last_name = nameArr[1];
		console.log("first name added")
                break;
            case "PHONE_NUMBER":
                params.phone_number = element.string_value;
                console.log("phone number Added");
		break;
            default:
                console.log(`ATTEMPTED TO IMPORT MISSING VALUE FROM GOOGLE LEAD. VALUE: ${element.column_id} DID NOT PROCESS CORRECTLY`);
        }
    });

    //Push to Vici Dialer
<<<<<<< HEAD
    await axios({
	method: 'post',
	url: 'http://12.184.68.100/vicidial/non_agent_api.php',
	data: params,
    })
    .then("axios request went through")
    .catch("Error Pushing to Vici")
=======
    var req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            process.stdout.write(d)
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(params);
    req.end();
>>>>>>> d1be4f501f86cff292321225ae982eefc680449e

    const dbConnect = dbo.getDb().g_db; //get the google DB inside of Atlas Cluster

    //Push data to a database.
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
    console.log("Incorrect Authorization for google lead");
}

});

module.exports = router;
