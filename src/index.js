const express = require("express");
const ewelink = require("ewelink-api");
const mongoose=require("mongoose");
require("dotenv").config();
const userRoutes=require("./routes/user");
const sonoffRoutes=require("./routes/sonoff");
const alarmsRoutes=require("./routes/alarmas");

const app = express();
const port=process.env.PORT ||9000;
//middleware
app.use(express.json());
app.use('/api',userRoutes);
app.use('/api',sonoffRoutes);
app.use('/api',alarmsRoutes);



//routes
app.get('/',(req,res)=>{
    res.send("Panel de alarmas");
});

// db connection
mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("Connected to mongodb atlas"))
.catch((error)=>console.error(error));

app.listen(port,()=>
console.log("server listening on port ",port));
