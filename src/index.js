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
var statusPow;
var statusSirena;
var statusPuerta;
//middleware
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
  email,
  password,
  region,
});

async function changeState(arg) {

  if (connection) {
    const status = await connection.toggleDevice(idDual, arg);
  }

}


async function dataEwelink() {

  // lee el estado del sonoff
  // async function leerEstado() {

  // crea la instancia ewelink




   while (true) {


  // await new Promise(resolve => setTimeout(resolve, 1000));
  setInterval(() => {


    (async () => {


      //  console.log(connection);



      const pow = await connection.getDevice(idPow);

      // console.log(pow);
      //lee los datos de la api ewelink

      voltaje = (pow['params']['voltage']);
      current = (pow['params']['current']);
      statusPow = (pow['params']['switch']);
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

      const dual = await connection.getDevice(idDual);
      statusSirena = dual['params']['switches'][0]['switch'];
      statusPuerta = dual['params']['switches'][1]['switch'];
      //  console.log(dual['params']['switches']);
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

      //guarda los datos en la base de datos
      axios.post("https://backendjc.herokuapp.com/api/sonoffData", sonoff).then(function (response) {
        // console.log(response.data)

      }).catch(function (error) {
        console.log(error);
      });




    })();
    ////////////////////////////////////////
    //}
  }, 1000);
}

//leerEstado();
// setInterval(leerEstado, 1000);

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
