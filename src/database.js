// aquí está la conexión con la base de datos mongoose de forma local

const mongoose = require('mongoose');           // requerimos mongoose el cual es el intermediario entre nuestra app y la base de datos.
const { mongodb } = require('./keys');          // requerimos la dirección con la que nos vamos a conectar.

mongoose.connect(mongodb.URI, {useNewUrlParser: true })     // nos conectamos y organizamos el archo de configuraciones.
    .then(db => console.log('Database is connected'))       // si nos conectamos mostramos que nos conectamos a la base de datos.
    .catch(err => console.error(err));                      // si no nos conectamos mostramos el error.