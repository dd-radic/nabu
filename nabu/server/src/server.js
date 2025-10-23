const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connect } = require("./db-connection.js");
const path = require("path");

//Not completely sure if these two are needed
const { exec } = require('child_process');
const { profile } = require('console');
//


app.use(bodyParser.json());

//////////////////////////////////////////
///              USERS                 ///
//////////////////////////////////////////

app.post("/api/signup", async(req, res) => {
    try{
        const salt = await bcrypt.genSalt();
        const encPass = await bcrypt.hash(req.body.password, salt);

        //TODO: Use JavaScript to execute a query in the database to sign up the user

        //Note: res.status(200) means that the API call succeeded
        res.status(200).json({message: "User signed up!", result});
    } catch(err) {
        //Note: Each page should throw a different MSB for its status, and each error should throw a different LSB,
        //Example: Another error on this page could have res.status(102) and an error on another page could have res.status(201)
        res.status(101).json({error: err.message});
    }
});