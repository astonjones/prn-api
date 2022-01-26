# PRN API

Stack:

- nodejs
- express
- mongoDB

This application is a simple api that handles leads that come from Facebook and Google.

Once a user submits information from Facebook/Google it makes a post request to the API.
That user data is then pushed to a mongo database. The data is also pushed into a
VICIDIAL dialer system hopper so that an available agent will make the call to that user.

To run:

There are a number of environment variables associated this application that you will need to gather:

- process.env.VERIFY_TOKEN      - This will be provided by facebook when you register your app
- process.env.APP_SECRET        - This will be provided by facebook when you register your app
- process.env.ACCESS_TOKEN      - This will be provided by facebook when you register your app
- process.env.GOOGLE_SECRET     - This secret will be made when you setup a "Google Lead Ad" that secret should match this one in your code.
- process.env.VICI_USER         - You'll need an account through VICIDIAL for this variable
- process.env.VICI_PASS         - This is the password associated with your VICIDIAL user
- process.env.VICI_IP           - This is the IP address that is hosted by your vicidialer system
- process.env.CONNECTION_STRING - This is your mongoDB connection string

1.) After cloning, in terminal run "npm install"

2.) run "node app.js" to run the application.

The application doesn't do anything unless a user is submits data via Google or Facebook.
It is more efficient to set this up on a reverse proxy such as Apache or Nginx.
