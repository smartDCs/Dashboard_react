const express=require("express");
const router=express.Router();
const sonoffSchema=require("../models/sonoffPow");

const cors = require("cors");

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
//read sonoff data base
router.get("/asonoffData",(req,res)=>{
   res.send('hola');
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