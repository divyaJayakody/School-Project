var mongoose = require('mongoose');
var SchoolSchema = new mongoose.Schema({
    schoolName: String,
    address:{
        street:String,
        suburb:String,
        postcode:Number,
        state:String,
    },
    noOfStudents: Number,

});

mongoose.model('School', SchoolSchema);

module.exports = mongoose.model('School');
