/*  This file defines the database configurations for the project, the keys are located in a separate location */

const mongoKeys =  require('./keys')

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;


const dbname = mongoKeys.dbname;
const dbpassword = mongoKeys.dbpassword;
const dbusername = mongoKeys.dbusername;
const clustername = mongoKeys.clustername;
const clusteroptions = mongoKeys.clusteroptions;

const url = "mongodb+srv://"+dbusername+":"+dbpassword+"@"+clustername+"/"+dbname+"?"+clusteroptions+"";

// Options for mongoDB
const mongoOptions = {useNewUrlParser : true,useUnifiedTopology: true};

const state = {
    db : null,
    client : null
};

const connect = (conn) =>{
    //if state of the db is not NULL, connection is established.
    if(state.db)
        conn();
    else{
        //attempt to create database connection
        MongoClient.connect(url, mongoOptions,(err,client)=>{
            // unable to get database connection pass error to conn
            if(err)
                conn(err);
            // Successfully got our database connection
            // Set database connection and call conn
            else{
                state.db = client.db(dbname);
                conn();
            }
        });
    }
};


// returns database connection
const getDB = ()=>{
    return state.db;
};


module.exports = {getDB,connect};
