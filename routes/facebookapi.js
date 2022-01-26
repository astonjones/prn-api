const express = require('express');
const router = express.Router();

//Authorization Keys
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'token';
const APP_SECRET = process.env.APP_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

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

//This route gets called when Facebooks webhook occurs - which is on user submit
router.post('/', async function(req, res) {
    console.log('Facebook request body:', req.body);
    if (!req.isXHubValid()) {
        console.log('Warning - request header X-Hub-Signature not present or invalid');
        return res.sendStatus(401);
    }
    console.log('request header X-Hub-Signature validated');

    if(req.body.object == "page"){
        const changes = req.body.entry[0].changes;

        try { await dataCollection.insertMany(changes) }
        catch (error) { console.log(error) }

        let promises = [];

        for(let change of changes) {
            const leadgenId = change.value.leadgen_id; //get leadgen_id from each change
            let lead;

            try { lead = await axios.get(`https://graph.facebook.com/v12.0/${leadgenId}/?access_token=${ACCESS_TOKEN}`) }
            catch (err) { console.log(`AXIOS RESPONSE ERROR ==> ${err}`) }

            promises.push(lead);
        }

        try {
            const results = await axios.all(promises);
            leadCollection.insertMany(results) 
        }
        catch (err) { console.err(`MONGODB DATA INSERTION ERROR ==> ${err}`) }
    
        res.sendStatus(200);
    }
});

module.exports = router;