const controllers={}

// importamos los modelos
var sequelize=require('../model/database');
var sonoff=require('../model/sonoffPow');

controllers.testData=async (req,res)=>{
    res.send("hola mundo");
    const response=await sequelize.sync().then(function(){
        const data=sonoff.findAll();
        return data;
    }).catch(error=>{
        return error;
    });
    res.json(response);
}

module.exports=controllers;