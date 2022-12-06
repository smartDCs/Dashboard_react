const express=require("express");
const router=express.Router();
const alarmSchema=require("../models/alarmas");
//save alarms data
router.post("/alarmsData",(req,res)=>{
    const alarm=alarmSchema(req.body);
    alarm
    .save()
    .then((data)=>res.json(data))
    .catch((error)=>res.json({
        message:error
    }));
});

//read alarms data base
router.get("/alarmsData",(req,res)=>{
    alarmSchema
    .find()
    .then((data)=>res.json(data))
    .catch((error)=>res.json({
        message:error
    }));
});

//read an alarm data 
router.get("/alarmsData/:id",(req,res)=>{
    const {id}=req.params;
    console.log(id)
    alarmSchema
    .findById(id)
    .then((data)=>res.json(data))
    .catch((error)=>res.json({
        message:error
    }));
});

//update an alarm
router.put("/alarmsData/:id",(req,res)=>{
    const {id}=req.params;
    const {type,zone,status,createdAt,updatedAt}=req.body;
    alarmSchema
       .updateOne({_id:id},{$set:{type,zone,status,createdAt,updatedAt}})
       .then((data)=>res.json(data))
       .catch((error)=>res.json({
           message:error
       }));
   });
   
   //delete an alarm
router.delete("/alarmsData/:id",(req,res)=>{
    const {id}=req.params;
    alarmSchema
       .remove({_id:id})
       .then((data)=>res.json(data))
       .catch((error)=>res.json({
           message:error
       }));
   });


module.exports=router;