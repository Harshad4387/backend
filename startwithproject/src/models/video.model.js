const mongoose = require('mongoose');
const mongooseaggregatepassinate = require('mongoose-aggregate-paginate-v2');
const videoSchema = new mongoose.Schema({
    videofile :  {
        type : String, //couldnairy
        required : true 
    } ,
    thumbnail : {
        type : String, //couldnairy
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user'
    },
    title : {
        type : String ,
        required : true 
    },
    description : {
        type : String ,
        required : true 
    },
    duration : {
        type : Number ,
        required : true 
    },
    view : {
        type : Number,
        default : 0
    },
    ispublished  : { 
        type : boolean,
        default : true 
    }
},{timestamps : true });
videoSchema.plugin(mongooseaggregatepassinate);
const video = mongoose.model('video',videoSchema);
module.exports = video;