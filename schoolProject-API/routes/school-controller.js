var express = require('express');
const db = require("../Repository/db-config");
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


/* GET  school listing. */
const schoolCollection = "schools";

//Get all companies
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

module.exports = router;
