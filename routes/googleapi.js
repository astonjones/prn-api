const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const https = require('https');
const dbo = require('../db/conn'); //DB connection
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const VICI_USER = process.env.VICI_USER;
const VICI_PASS = process.env.VICI_PASS;
const VICI_IP = process.env.VICI_IP;

router.use(bodyParser.json());

router.get('/', function(req, res){
    res.status(400).send("Bad Request. You do not have access.");
})

router.post('/leadData', async function(req, res){
if(req.body.google_key == GOOGLE_SECRET){
    //url parameters to send with post request
    const params = JSON.stringify({
        phone_code: "1",
        list_id: "98769876", //ASSIGNED TO TEST LIST
        source: "This lead is coming from google ads.",
        function: "add_lead",
        user: `${VICI_USER}`,
        pass: `${VICI_PASS}`,
        first_name: "",
        last_name: "",
        phone_number: ""
    });

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

    //push data to vici 
    axios.post(`http://${VICI_IP}/vicidial/non_agent_api.php`, {}, params)
        .then(res => {
            console.log("axios request went through")
            console.log(`statusCode: ${res.status}`);
        })
        .catch(error => { console.error(error)});

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
