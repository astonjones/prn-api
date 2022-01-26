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

app.get('/', function(req, res) {
    res.sendFile('/index.html' , { root : __dirname});
});

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