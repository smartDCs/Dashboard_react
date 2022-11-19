const express=require("express");
const router=express.Router();
const userSchema=require("../models/user");
const cors = require("cors");
require("dotenv").config();
router.use(cors());
//create user
router.post("/usersDash",(req,res)=>{
    const user=userSchema(req.body);
    user
    .save()
    .then((data)=>res.json(data))
    .catch((error)=>res.json({
        message:error
    }));
});

//get all users
router.get("/usersDash",(req,res)=>{
   userSchema
    .find()
    .then((data)=>res.json(data))
    .catch((error)=>res.json({
        message:error
    }));
});

//get a user
router.get("/usersDash/:email",(req,res)=>{
  const {email, password}=req.params;
    userSchema
    .findOne({
        email:email,
        password:password,
    })
     .then((data)=>res.json(data))
     .catch((error)=>res.json({
         message:error
     }));
 });
 
//update a user
router.put("/usersDash/:id",(req,res)=>{
    const {id}=req.params;
    const {name,email,role,password}=req.body;
      userSchema
       .updateOne({_id:id},{$set:{name,email,role,password}})
       .then((data)=>res.json(data))
       .catch((error)=>res.json({
           message:error
       }));
   });
   
   //delete a user
router.delete("/usersDash/:id",(req,res)=>{
    const {id}=req.params;
      userSchema
       .remove({_id:id})
       .then((data)=>res.json(data))
       .catch((error)=>res.json({
           message:error
       }));
   });
   
module.exports=router;