const express = require("express");
const ewelink = require("ewelink-api");
const app = express();
const routes = require('./routes/Routes');
const cors=require("cors");
const database = require("./model/database");


(async()=>{
try{
  await database.authenticate();
  await database.sync(); //crea las tablas en la base de datos
  console.log("conexion a la base de datos exitosa");
}catch(error){
  throw new Error(error)
}
})()




//middleware
app.use(express.json());
app.use(cors()); //habilitar otras aplicaciones para realizar solicitudes 

app.use(routes); 

/*

app.get('/', function (req, res) {
  res.send("estado del dispositivo");
  const connection = new ewelink({
    email: 'davidchicaisa@gmail.com',
    password: 'Domotica2014',
    region: 'us',
  });
  // lee el estado del sonoff
  async function leerEstado() {

    while (true) {
await new Promise(resolve=>setTimeout(resolve,500));
      (async () => {

      
        try {
         
          //  const devices = await connection.getDevices();
     //   console.log(devices);
        const status = await connection.getDevicePowerState('100042b09d');
        console.log("estado del switch " + status.state);
        //leer el voltaje del sonoff pow
        const devices = await connection.getDevice('100042b09d');
          const voltaje = (devices['params']['voltage']);
          console.log("voltaje del sistema " + voltaje);
        
        }
        catch (error) { console.log(error) }


      })();
      ////////////////////////////////////////
    }
  }

leerEstado();
 // setInterval(leerEstado, 1000);

});

*/

app.listen(4000, () => {
  console.log("El servidor está inicializado en el puerto 4000");
});