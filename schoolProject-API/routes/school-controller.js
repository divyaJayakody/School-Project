const express = require('express');

const Joi = require('@hapi/joi');
// const Joi = require('joi');
const db = require("../Repository/db-config");
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let mongo = require('mongodb');
const axios = require('axios');



/* Address Validation Schema. */
const addressSchema = Joi.object().keys({
  street:Joi.string().required(),
  suburb:Joi.string().required(),
  postcode:Joi.number().required(),
  state:Joi.string().required(),
});
/* School Validation Schema. */
const schoolSchema = Joi.object().keys({
  schoolName: Joi.string().required(),
  noOfStudents: Joi.number().required(),
  address: addressSchema
});


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


router.post('/add', (req, res) => {

  // Payload from the request
  let data = req.body;

  console.log("request data : ", data);

  const validation = schoolSchema.validate(data);

  if (!validation.error) {

       let school = new School();

        school.schoolName = data.schoolName;
        school.address.street = data.address.street;
        school.address.suburb = data.address.suburb;
        school.address.postcode = data.address.postcode;
        school.address.state = data.address.state;
        school.noOfStudents = data.noOfStudents;

        // Inserting into DB
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
