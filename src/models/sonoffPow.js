const mongoose=require("mongoose");

const sonoffSchema=mongoose.Schema({
 
    name:{
        type:String,
        required:true
    },
    voltaje:{
      type:Number,
      required:true  
    },
    current:{
      type:Number,
      required:true  
    },
    status:{
        type:Boolean,
        required:true
    }

});

module.exports=mongoose.model('SonoffPow',sonoffSchema);