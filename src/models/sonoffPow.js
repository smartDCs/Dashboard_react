const mongoose=require("mongoose");

const sonoffSchema=mongoose.Schema({
    deviceId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    voltaje:{
      type:Number,
      required:true  
    },
    status:{
        type:Boolean,
        required:true
    }

});

module.exports=mongoose.model('SonoffPow',sonoffSchema);