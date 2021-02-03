const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
// name of our database
const dbname = "skoolbag";
// location of where our mongoDB database is located

const url = "mongodb+srv://divya:divya@cluster0.ukgyf.mongodb.net/skoolbag?retryWrites=true&w=majority";

// Options for mongoDB
const mongoOptions = {useNewUrlParser : true};

const state = {
    db : null,
    client : null
};

const connect = (cb) =>{
    // if state is not NULL
    // Means we have connection already, call our CB
    if(state.db)
        cb();
    else{
        // attempt to get database connection
        MongoClient.connect(url, mongoOptions,(err,client)=>{
            // unable to get database connection pass error to CB
            if(err)
                cb(err);
                // Successfully got our database connection
            // Set database connection and call CB
            else{
                state.db = client.db(dbname);
                state.client = client;
                cb();
            }
        });
    }
};

// returns OBJECTID object used to
const getPrimaryKey = (_id)=>{
    return ObjectID(_id);
};

// returns database connection
const getDB = ()=>{
    return state.db;
};

const getDbName = ()=>{
    return dbname;
};

const getClient = ()=>{
    return state.client;
};

module.exports = {getDB,getClient,getDbName,connect,getPrimaryKey};
