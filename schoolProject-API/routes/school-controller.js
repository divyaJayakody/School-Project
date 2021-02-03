/*  This file handles the Inserting and Retrieving operations of schools to / from database  */

const express = require('express');
const Joi = require('@hapi/joi');
const validation_schema = require ('../helpers/validating_schemas');
const db = require("../helpers/db-config");
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const School = require("../models/School");
const schoolCollection = "schools";


/* GET  school listing. */
router.get('/list',(req,res)=>{

  db.getDB().collection(schoolCollection).find().toArray((err,result)=>{
    if(err){
      res.status(404).json({
        success : false,
        message : "failed to find schools in the DB",
        document : null,
        messageDetails : err
      });
    }
    else{
      if(result && result.length !== 0){

        let school = result;
        school = school.filter( res => {
          return !res.deleted;
        });

        res.status(200).json({
          success : true,
          message : "successfully retrieved the documents from DB",
          document : school,
          messageDetails : "no error"
        });

      }else{
        res.status(404).json({
          success : false,
          message : "failed to find documents in DB",
          document : null,
          messageDetails : err
        });
      }
    }
  });
});

/* POST a new school. */
router.post('/add', (req, res) => {

  /* Payload sent from client */
  let data = req.body;

  console.log("request data : ", data);

  const validation = validation_schema.schoolSchema.validate(data);

  if (!validation.error) {
        /* If no validation errors ,proceed with POST operation */
       let school = new School();

        school.schoolName = data.schoolName;
        school.address.street = data.address.street;
        school.address.suburb = data.address.suburb;
        school.address.postcode = data.address.postcode;
        school.address.state = data.address.state;
        school.noOfStudents = data.noOfStudents;

        /* Inserting into DB */
        db.getDB().collection(schoolCollection).insertOne(school, (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "failed to insert document to DB",
              document: null,
              messageDetails: err
            });
          } else
            return res.status(201).json({
              success: true,
              message: "successfully inserted document to DB",
              document: result.ops[0],
              messageDetails: "no error"
            });
        });

  } else {
    res.status(422).json({
      message: 'Validation error.',
      error: validation.error,
    });
  }

});

module.exports = router;
