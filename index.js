const express = require("express");
const ewelink=require("ewelink-api");
const app = express();

app.get('/', function (req, res) {
  res.send("estado del dispositivo");
  const connection = new ewelink({
    email: 'davidchicaisa@gmail.com',
    password: 'Domotica2014',
    region: 'us',
  });
  // lee el estado del sonoff
 function leerEstado()
 {
  (async () => {

  
  
    //const devices = await connection.getDevices();
    //console.log(devices);
   const status = await connection.getDevicePowerState('100042b09d');
  console.log("estado del switch "+status.state);
 
  //console.log("estado del canal "+status.state);
  const devices = await connection.getDevice('100042b09d');
try{
  const voltaje=(devices['params']['voltage']);
  console.log("voltaje del sistema "+voltaje);
}
catch(error){console.log(error)}
 // res.json(status);
 
  })();
   ////////////////////////////////////////
 } 


setInterval(leerEstado,1000);

  });

 

app.listen(4000, () => {
 console.log("El servidor está inicializado en el puerto 4000");
});