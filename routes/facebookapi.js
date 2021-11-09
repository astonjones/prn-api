const express = require('express');
const router = express.Router();

//Authorization Keys
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'token';
const APP_SECRET = process.env.APP_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

//This route submits a bad request on get request
router.get('/', function(req, res) {
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == VERIFY_TOKEN
    ) {
        res.send(req.query['hub.challenge']);
    } else {
        console.log("Facebook route reached");
        res.sendStatus(400);
    }
});

    //This route gets called when a webhook occurs
router.post('/', async function(req, res) {
    console.log('Facebook request body:', req.body);
    if (!req.isXHubValid()) {
        console.log('Warning - request header X-Hub-Signature not present or invalid');
        return res.sendStatus(401);
        // return;
    }
    console.log('request header X-Hub-Signature validated');
      
    // Process the Facebook updates below this line
    // received_updates.unshift(req.body);

    //if the webhook is of Page variety then store the webhook data within the mongoDB cluster
    if(req.body.object == "page"){
        const changes = req.body.entry[0].changes;

        try { await dataCollection.insertMany(changes) }
        catch (error) { console.log(error) }

    //need to grab the lead here and push it to the MongoDB
        const promises = [];
        for(let change of changes) {
        const leadgenId = change.value.leadgen_id; //get leadgen_id from each change
        let lead;

        console.log(`leadgen_ID before axios request: ${leadgenId}`);

        try { lead = await axios.get(`https://graph.facebook.com/v12.0/${leadgenId}/?access_token=${ACCESS_TOKEN}`) }
        catch (err) { console.log(`AXIOS RESPONSE ERROR ==> ${err}`) }

        promises.push(lead);
        }

        try { 
        const results = await axios.all(promises);
        leadCollection.insertMany(results) 
        }
        catch (err) { console.log(`MONGODB DATA INSERTION ERROR ==> ${err}`) }
    
        res.sendStatus(200);
    }
});

module.exports = router;