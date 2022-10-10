const express=require("express");
const router=express.Router();
const sonoffSchema=require("../models/sonoffPow");
const ewelink = require("ewelink-api");
const cors = require("cors");
require("dotenv").config();
router.use(cors());
//save sonoff data
router.post("/sonoffData",(req,res)=>{
    const pow=sonoffSchema(req.body);
    pow
    .save()
    .then((data)=>res.json(data))
    .catch((error)=>res.json({
        message:error
    }));
});


//read sonoff data base
router.get("/sonoffData",(req,res)=>{
    sonoffSchema
    .find()
    .then((data)=>res.json(data))
    .catch((error)=>res.json({
        message:error
    }));
});
//read sonoff data from fornt end

router.get("/asonoffData",(req,res)=>async function dataEwelink(){
  // read ewelink data
const email = process.env.email;
const password = process.env.password;
const region = process.env.region;



  // lee el estado del sonoff
    const connection = new ewelink({
      email,
      password,
      region,
    });
   
    

        try {
          const deviceid = '100042b09d';
          const pow = await connection.getDevice(deviceid);
          //console.log(pow);
          const voltaje = (pow['params']['voltage']);
          const current = (pow['params']['current']);
          var status = (pow['params']['switch']);
          console.log("voltaje del sistema " + voltaje);
          console.log("corriente del sistema " + current);
          console.log("estado el interruptor " + status);
          if (status == 'on') {
            status = 1;
          } else {
            status = 0;
          }
          const sonoff = {
            deviceId: '100042b09d',
            name: "sonoff pow",
            voltaje: voltaje,
            current: current,
            status: status,

          };
         res.json(sonoff);


          

        }
        catch (error) {
          console.log(error)
        }

res.send("hola");
    
 
});
//read a sonoff data
router.get("/sonoffData/:id",(req,res)=>{
    const {id}=req.params;
    sonoffSchema
    .findById(id)
    .then((data)=>res.json(data))
    .catch((error)=>res.json({
        message:error
    }));
});




module.exports=router;