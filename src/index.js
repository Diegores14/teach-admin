const express = require('express');     // este es el framework de nodejs.
const engine = require('ejs-mate');     // este es el motor-manejador de archivos.
const path = require('path');           // se utiliza para poder unir paths o cosas por el estilo.
const morgan = require('morgan');       // morgan es para observar las rutas que nos estan pidiendo.
const passport = require('passport');
const session = require('express-session'); // para generar las sesiones 
const flash = require('connect-flash');

// Initializations
const app = express();                  // aquí iniciamos la aplicacion express.
require('./database');
require('./passport/local-auth');

// settings
app.set('views', path.join(__dirname, 'views'));    // aquí definimos la direccion de las vistas.
app.engine('ejs', engine);                          // decimos cuale es el motor de archivos ejs.
app.set('view engine', 'ejs');                      // guardamos el motor ejs.
app.set('port', process.env.PORT || 3000);          // aquí definimos el puerto por el cual vamos a escuchar si el sistema operativo no nos da el puerto sera el 3000.
app.use(express.static(__dirname + '/public'));     // aquí ponemos la direccion estatica de la carpeta public para poder importar el css y imagenes.

// middlewares
app.use(morgan('dev'));                             // aquí iniciamos morgan para que nos muestre las peticiones con las opciones de dev
app.use(express.urlencoded({extended: true}));      // nos permite recibir los datos desde el cliente
app.use(session({
    secret: 'myscretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.user = req.user;
    next();
});

// Routes
app.use('/', require('./routes/index'));            // usar para la ruta raiz lo que esta en el archivo de rutas.

//starting the server
app.listen(app.get('port'), () => {
    console.log('Server on Port', app.get('port'));
});