# Vidly Service
This repository is an API built with Node.js and Express.js. It attempts to setup a mock scenario of handling movies at a movie rental store.  There are full RESTful endpoints setup, authentication, authorization, error handling, and logging.
## Prerequisites
To run this service, you must have a local instance of both Node and MongoDB installed on your machine.
## Installing packages
You can use NPM to install the package dependencies for the application.  Run the following command:
```
npm install
```
## Running the Service Locally
To run the application, run the following command:
```
npm start
```
This will spin up the server on `localhost:3000` attempt to make a connection to your local MongoDB instance.

## Using the Production Service
The service is deployed to a Heroku environment, and the data is being stored in a MongoDB Atlas Cloud database.  The current production application can be viewed [here](https://vidly-service.herokuapp.com/).