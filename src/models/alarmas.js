const mongoose=require("mongoose");

const alarmsSchema=mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    zone:{
        type:String,
        required:true
    },
    status:{
      type:Boolean,
      required:true  
    },
    createdAt:{
        type:String,
        required:true
    }
    ,
    updatedAt:{
        type:String,
        required:false
    }

});

module.exports=mongoose.model('Alarmas',alarmsSchema);