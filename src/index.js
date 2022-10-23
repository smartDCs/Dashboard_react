var express = require("express");
const ewelink = require("ewelink-api");
const mongoose = require("mongoose");
const axios = require('axios');
var http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const sonoffRoutes = require("./routes/sonoff");
const alarmsRoutes = require("./routes/alarmas");
const { isBuffer } = require("util");
const { json } = require("express");
const port = process.env.PORT || 9000;

var app = express();
app.set('port', port);

var server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

//variables 
var voltaje;
var current;
var statusPow;
var statusSirena;
var statusPuerta;
var connection=null;
var dual = null;


app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', sonoffRoutes);
app.use('/api', alarmsRoutes);
app.use(cors());
//routes
app.get('/', (req, res) => {

  res.send("backend");
});


// db connection

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Connected to mongodb atlas"))
  .catch((error) => console.error(error));

// read ewelink data
const email = process.env.email;
const password = process.env.password;
const region = process.env.region;
const idPow = process.env.idPow;
const idDual = process.env.idDual;


async function changeState(arg) {

  if (connection) {
    const status = await connection.toggleDevice(idDual, arg);
  }

}


async function dataEwelink() {

  setInterval(() => {


    (async () => {


      console.log("conectando.... ewelink");

try{
       connection = new ewelink({
        email,
        password,
        region,
      });
    }catch(error){
      console.log("error en instanciar la conexxion ",error);
    }
    /*
      try {
        const login = await connection.getCredentials();

      } catch (error) {
        console.log("error en la obtencion de credenciales ", error);
        return
      }*/
      try {


        const pow = await connection.getDevices();

        console.log(pow.length);
        for (var i = 0; i < pow.length; i++) {
          if (pow[i].deviceid == idPow) {
            console.log('sonoff pow ', pow[i].deviceid);
            statusPow=pow[i].params.switch;
            voltaje=pow[i].params.voltage;
            current=pow[i].params.current;
            console.log(statusPow);
            console.log(voltaje);
            console.log(current);

            if (statusPow == 'on') {
              statusPow = 1;
            } else {
              statusPow = 0;
            }
            const sonoff = {
    
              name: "sonoff pow",
              voltaje: voltaje,
              current: current,
              status: statusPow,
    
            };
            axios.post("https://backendjc.herokuapp.com/api/sonoffData", sonoff).then(function (response) {
              // console.log(response.data)
    
            }).catch(function (error) {
              //  console.log(error);
            });

          }
          //console.log(pow[i].deviceid);
        }
      } catch (error) {
        console.error("malditacióoooooooooooon ", error);
        return
      }

      /*
      if (pow != null) {
        //  console.log("??????? ", typeof(JSON.parse(data)));
        const data = pow.params;
        console.log("***********************", typeof (data));
        if (typeof (data) == 'undefined') {
          console.log('ushdndmd');

        }
        */
      /*  voltaje = (data['voltage']);
         current = (data['current']);
         statusPow = (data['switch']);
         console.log("voltaje del sistema " + voltaje);
         console.log("corriente del sistema " + current);
         console.log("estado el interruptor " + statusPow);
         if (statusPow == 'on') {
           statusPow = 1;
         } else {
           statusPow = 0;
         }
         const sonoff = {
 
           name: "sonoff pow",
           voltaje: voltaje,
           current: current,
           status: statusPow,
 
         };
         //guarda los datos en la base de datos
         axios.post("https://backendjc.herokuapp.com/api/sonoffData", sonoff).then(function (response) {
           // console.log(response.data)
 
         }).catch(function (error) {
           //  console.log(error);
         });
 */
      // }




      //const auth = await connection.getCredentials();
      /*
         try {
           dual = await connection.getDevice(idDual);
   
   
         } catch (error) {
           console.error("error en la comunicacion ewelink ", error);
   
         }
         */
      /*
      if (dual != null) {

        statusSirena = dual['params']['switches'][0]['switch'];
        statusPuerta = dual['params']['switches'][1]['switch'];

        console.log("Sirena ", statusSirena);
        console.log("Puerta ", statusPuerta);
        if (statusSirena == 'on') {
          statusSirena = 1;
        } else {
          statusSirena = 0;
        }
        if (statusPuerta == 'on') {
          statusPuerta = 1;
        } else {
          statusPuerta = 0;
        }

      }
*/





    })();

  }, 1000);


}


io.on("connection", (socket) => {
  console.log('user conected', socket.id);
  setInterval(() => {
    socket.emit('powData', voltaje, current, statusPow);
    socket.emit('dualData', statusSirena, statusPuerta);
  }, 100);

  socket.on('toggleChannel', function (arg) {
    changeState(arg);

    // const status = await connection.toggleDevice(idDual, 0);

    //console.log(status);
  })
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });



});


server.listen(port, () => {


  dataEwelink();
});

console.log("server on port ", port);






//console.log("server listening on port ",port));
