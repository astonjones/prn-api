require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
// const https = require('https');
// const http = require('http');
// const fs = require('fs');
const xhub = require('express-x-hub');
const axios = require('axios');
const { MongoClient } = require('mongodb');
// const port = process.env.PORT

const app = express();
app.use(cors());

const facebookRoutes = require('./routes/facebookapi');
const googleRoutes = require('./routes/googleapi');

// app.set('port', (process.env.PORT || 5000));
// app.listen(app.get('port'));

app.use(express.static(path.join(__dirname, 'build'), {dotfiles: 'allow'}));
app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

const CONNECTION_STRING = process.env.CONNECTION_STRING; //Atlas connection string
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'token';
const APP_SECRET = process.env.APP_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const received_updates = [];

if (!(APP_SECRET && VERIFY_TOKEN && ACCESS_TOKEN)) {
console.error('Missing config values');
process.exit(1);
}

//wrap express requests inside of mongo client
MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client =>{
    console.log("connected to Database");
    const f_db = client.db('facebook-data');
    const g_db = client.db('google-data');
    const g_leadCollection = g_db.collection('g-leads');
    const fb_leadCollection = f_db.collection('fb-leads');

    //index route
    app.get('/', function(req, res) {
        res.sendFile('/index.html' , { root : __dirname});
        console.log("Recieved updates are displayed here.");
    });
    
    //This route submits a bad request on get request
    app.get('/instagram', function(req, res) {
        if (req.query['hub.mode'] == 'subscribe' &&
            req.query['hub.verify_token'] == VERIFY_TOKEN) 
        {
            res.send(req.query['hub.challenge']);
        } else {
        res.sendStatus(400);
        }
    });

    //instagram post request
    app.post('/instagram', function(req, res) {
        console.log('Instagram request body:');
        console.log(req.body);
        // Process the Instagram updates here
        received_updates.unshift(req.body);
        res.sendStatus(200);
    });
})
.catch(error => console.error(error));

app.use('/facebook', facebookRoutes);
app.use('/google', googleRoutes);

//http server - not needed in this instance
// const httpServer = http.createServer(app);
// const httpsServer = https.createServer({
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
// }, app);

// for Http requests, not need for API endpoints
// httpServer.listen(80, () => {
//     console.log('HTTP Server running on port 80');
// });

// httpsServer.listen(443, () => {
//     console.log('HTTPS server running on port 443')
// });

app.listen(5000, () => {
    console.log('Server listening on port 5000');
});