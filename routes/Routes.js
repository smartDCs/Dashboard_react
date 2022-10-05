const router = require('express').Router();
//const router =express.Router();
const ewelink = require("ewelink-api");
//const SonoffController = require('../controller/SonoffController');
const sonoffPow = require('../model/sonoffPow');

//obtener los datos de la data base sonoff
router.get('/pow/:id', (req, res) => {
  const { id } = req.params;

  res.json({
    id,
    voltaje: 110,
    status: 'on'
  });
});

router.post('/pow', (req, res) => {
  const { deviceid, name, voltaje, status } = req.body;
  res.json({
    deviceid,
    name,
    voltaje,
    status

  })
});


router.get('/', async function (req, res) {
  const dataPow = await sonoffPow.findAll();
  console.log(dataPow.length);
  //res.send("estado del dispositivo");
  res.json(dataPow[dataPow.length - 1]);

  // lee el estado del sonoff
  async function leerEstado() {
    const connection = new ewelink({
      email: 'davidchicaisa@gmail.com',
      password: 'Domotica2014',
      region: 'us',
    });
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 500));
      (async () => {


        try {

          // const devices = await connection.getDevices();
          // console.log(devices);
          const deviceid = '100042b09d';
          const name = 'sonoff Pow';
          var status = false;


          
          const estatus = await connection.getDevicePowerState(deviceid);
          const estado = estatus.state;
          if (estado == 'on') {
            status = true;
          } else {
            status = false;
          }
          console.log("estado del switch " + status);
          //leer el voltaje del sonoff pow
          const devices = await connection.getDevice(deviceid);
          console.log(devices);
          
          if (typeof devices == 'Object') {
            const voltaje = (devices['params']['voltage']);
            console.log("voltaje del sistema " + voltaje);

            const sonoffData = await sonoffPow.create({ deviceid, name, voltaje, status });
            res.json(sonoffData);
          }



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

});


module.exports = router;