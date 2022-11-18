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

var voltaje = 0;
var current = 0;
var statusPow = 0;
var statusSirena = 0;
var statusPuerta = 0;
//var socket=null;
//var dual = null;


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

const connection = new ewelink({
  email: email,
  password: password,
  region: region,
});

async function websocket() {
  try {
    const auth = await connection.getCredentials();
  } catch (error) {
    console.log(error);
    websocket();
  }
  // get device power status
  //setInterval(async()=>{
  try {
    const socket_ewelink = await connection.openWebSocket(async data => {

      console.log("websocket abierto");


      const device = await connection.getDevice('100042b09d');
     try{
      voltaje=device.params.voltage;
      console.log(voltaje);
     }catch(error){
      console.log(error);
     }
      switch (data.deviceid) {
        case idPow:
          console.log("sonoff Pow ");

          //extraigo los datos de voltaje del sonoff pow
          try {
            const v = data.params.voltage;
            const c = data.params.current;
            const s = data.params.switch;
            if (v != null) {
              voltaje = v;
            }
            if (c != null) {
              current = c;
            }
            if (s != null) {
              statusPow = s;
            }

            //guardo los datos en la base de datos
            if (statusPow != null) {
              if (statusPow == 'on') {
                statusPow = 1;
              }
              if (statusPow == 'off') {
                statusPow = 0;
              }
            }
            const sonoff = {

              name: "sonoff pow",
              voltaje: voltaje,
              current: current,
              status: statusPow,

            };

            console.log('voltaje ', voltaje);
            console.log('corriente ', current);
            console.log('switch ', statusPow);
            axios.post("https://backendjc.herokuapp.com/api/sonoffData", sonoff).then(function (response) {
              // console.log(response.data)

            }).catch(function (error) {
              console.log(error);
              websocket();
            });
          } catch (error) {
            console.log(error);
          }
         // socket.emit('powData', voltaje, current, statusPow);
          break;

        case idDual:
          console.log("sonoff dual");
          try {
           // console.log((data.params.switches).length);
            statusSirena = data.params.switches[0].switch;
            statusPuerta = data.params.switches[1].switch;
            // changeState(1);
            if (statusPuerta == 'on') {
              statusPuerta = 1;
            } else {
              statusPuerta = 0;
            }
            if (statusSirena == 'on') {
              statusSirena = 1;
            } else {
              statusSirena = 0;
            }
            console.log('Puerta ', statusPuerta);
            console.log('Sirena ', statusSirena);
           // socket.emit('dualData', statusSirena, statusPuerta);
          
            break;
          } catch (error) {
            console.log(error);
          }

      }
      // console.log(data)
    });
  } catch (error) {

    console.log(error);
    websocket();
  }


}


async function changeState(arg) {


  const status = await connection.toggleDevice(idDual, arg);
  console.log("respuesta del toggle ", status);


}



io.on("connection", (socket) => {
  console.log('user conected', socket.id);
  setInterval(() => {
   
    socket.emit('dualData', statusSirena, statusPuerta);
   socket.emit('powData', voltaje, current, statusPow);
  }, 100);


  socket.on('toggleChannel', async function (arg) {
    console.log('cambiar de estado el canal ', arg);


    changeState(arg);


  })
 
  socket.on('togglePanico', async function (channel, fecha, status) {

    console.log(fecha);

    const alarma = {

      type: "Pánico",
      zone: "ALL",
      status: status,
      createdAt: fecha
    };

    axios.post("https://backendjc.herokuapp.com/api/alarmsData", alarma).then(function (response) {
      console.log(response.data)

    }).catch(function (error) {
      console.log(error);
      websocket();
    });
    changeState(channel);
  });

   

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });



});


server.listen(port, () => {

  websocket();
  //dataEwelink();
});

console.log("server on port ", port);







