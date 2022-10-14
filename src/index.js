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
var voltaje =0;
var  current=0;
//middleware
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', sonoffRoutes);
app.use('/api', alarmsRoutes);

//routes
app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/index.html');
  res.send("backend");
});

app.get('/asonoffData', (req, res) => {
  res.send("valores de sonoff");
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

//lee los datos de la api ewelink

           voltaje = (pow['params']['voltage']);
           current = (pow['params']['current']);
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
          //guarda los datos en la base de datos
          axios.post("https://backendjc.herokuapp.com/api/sonoffData", sonoff).then(function (response) {
            // console.log(response.data)
          }).catch(function (error) {
            console.log(error);
          });




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


io.on("connection", (socket) => {
  console.log('user conected', socket.id);
 
  socket.on('chek_pow',()=>{

    socket.emit('sonoff_voltaje', voltaje);
    socket.emit('sonoff_corriente', current);
  });
  socket.on('conectado', (arg) => {
    console.log(arg);
  })
  // socket.on('disconnect', function () {
  //   console.log('user disconnected');
  // });



});


server.listen(port);
 dataEwelink();
console.log("server on port ", port);






//console.log("server listening on port ",port));
