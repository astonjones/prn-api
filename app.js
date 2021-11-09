require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const xhub = require('express-x-hub');
const axios = require('axios');

//MongoDB Connection
const dbo = require('./db/conn');

//app utilities
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'build'), {dotfiles: 'allow'}));
app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

//Authorization Keys
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'token';
const APP_SECRET = process.env.APP_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

//Error Handling for Authorization Keys
if (!(APP_SECRET && VERIFY_TOKEN && ACCESS_TOKEN)) {
    console.error('Missing config values');
    process.exit(1);
}

//index route
app.get('/', function(req, res) {
    res.sendFile('/index.html' , { root : __dirname});
});
    
//This route submits a bad request on get request - used for instagram(Currently not in use)
// app.get('/instagram', function(req, res) {
//     if (req.query['hub.mode'] == 'subscribe' &&
//         req.query['hub.verify_token'] == VERIFY_TOKEN) 
//     {
//         res.send(req.query['hub.challenge']);
//     } else {
//     res.sendStatus(400);
//     }
// });

//instagram post request (Currently not in use)
// app.post('/instagram', function(req, res) {
//     console.log('Instagram request body:');
//     console.log(req.body);
//     // Process the Instagram updates here
//     received_updates.unshift(req.body);
//     res.sendStatus(200);
// });

//Routes in other folders
const facebookRoutes = require('./routes/facebookapi');
const googleRoutes = require('./routes/googleapi');

app.use('/facebook', facebookRoutes);
app.use('/google', googleRoutes);

//Connect to DB
dbo.connectToServer(function (err){
    if(err){
        console.error(err);
        process.exit();
    }

    app.listen(5000, () => {
        console.log('Server listening on port 5000');
    });
})