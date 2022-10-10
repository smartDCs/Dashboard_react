const express = require("express");
const ewelink = require("ewelink-api");
const mongoose = require("mongoose");
const axios = require('axios');

const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/user");
const sonoffRoutes = require("./routes/sonoff");
const alarmsRoutes = require("./routes/alarmas");

const app = express();
const port = process.env.PORT || 9000;
//middleware
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', sonoffRoutes);
app.use('/api', alarmsRoutes);

app.use(cors()); //habilitar otras aplicaciones para realizar solicitudes 


//routes
app.get('/', (req, res) => {
  res.send("Panel de alarmas");
});

// db connection
mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Connected to mongodb atlas"))
  .catch((error) => console.error(error));

// read ewelink data
const email = process.env.email;
const password = process.env.password;
const region = process.env.region;
async function dataEwelink() {


  // lee el estado del sonoff
  async function leerEstado() {
    const connection = new ewelink({
      email,
      password,
      region,
    });
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      (async () => {


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
          axios.post("http://localhost:9000/api/sonoffData", sonoff).then(function (response) {
            // console.log(response.data)
          }).catch(function (error) {
            console.log(error)
          });


          //  
          // const name = 'sonoff Pow';
          //var status = false;



          //const estatus = await connection.getDevicePowerState(deviceid);
          //const estado = estatus.state;
          //if (estado == 'on') {
          //  status = true;
          //} else {
          // status = false;
          // }
          // console.log("estado del switch " + status);
          //leer el voltaje del sonoff pow
          // const devices = await connection.getDevice(deviceid);
          // console.log(devices);
          /*  
             if (typeof devices == 'Object') {
               const voltaje = (devices['params']['voltage']); 
               console.log("voltaje del sistema " + voltaje);
   
               const sonoffData = await sonoffPow.create({ deviceid, name, voltaje, status });
               res.json(sonoffData);
             }
   */


        }
        catch (error) {
          console.log(error)
        }


      })();
      ////////////////////////////////////////
    }
  }

  leerEstado();
  // setInterval(leerEstado, 1000);

}



app.listen(port, () =>
  dataEwelink());
//console.log("server listening on port ",port));
