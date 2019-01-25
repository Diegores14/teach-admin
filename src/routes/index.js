// aquí vamos a tener el controlador de todas las rutas como debe funcionar al momento de un GET y POST

const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const Course = require('../models/course');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');
const CoEsCi = require('country-state-city');
const multer  = require('multer');
const uploadDocent = multer({ dest: path.resolve('src/public/img/Users/') });

// GET para la dirección raiz muestra la pagina principal
router.get('/', isAuthenticated, isAuthenticatedEmail, (req, res, next) => {
    res.render('profile');
});

// GET para Obtener el signup (registro)
router.get('/signup', (req, res, next) => {
    res.render('signup');
});

// Post para obtener todos los datos al momento de registro
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

// GET Obtener la pagina de Ingreso (singin)
router.get('/signin', (req, res, next) => {
    res.render('signin');
});

// POST para obtener los datos de ingreso 
router.post('/signin', passport.authenticate('local-signin',{
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

/*
router.use((req, res, next) => {
    isAuthenticated(req, res, next);
    next();
});
*/

router.get('/profile', isAuthenticated, isAuthenticatedEmail, (req, res, next) => {
    const user = req.user;
    res.render('profile',{user});
});

router.get('/completarUsuario', isAuthenticated, isAuthenticatedEmail, (req,res,next)=>{
    const data = [[], [], []];
    const country = CoEsCi.getAllCountries();
    country.forEach( (item) => {
        data[0].push([item.name, item.id]);
        const estate = CoEsCi.getStatesOfCountry(item.id);
        estate.forEach((state)=>{
            data[1].push([state.name, state.id, state.country_id]);
            const city = CoEsCi.getCitiesOfState(state.id);
            city.forEach((city)=>{
                data[2].push([city.name, city.id, city.state_id]);
            });
        });
    });
    const user = req.user;
    console.log(data[1]);
    res.render('CompletarRegistro', {pais: data[0], estado: data[1], ciudad: data[2],user});
});

router.post('/completarUsuario', isAuthenticated, uploadDocent.single('avatar'), (req, res, next) => {
    console.log(req.body);
    res.render('profile');
});

router.get('/logout', isAuthenticated, (req, res, next) => {
    req.logout();                                   // cierro la session
    res.redirect('/');
});

// Course
router.get('/courses', isAuthenticated, isAuthenticatedEmail, (req, res, next) => {
    // cargar los cursos, falta poner eso
    User.findById(req.user._id, (err, user) => {
        if(!err) {
            let data = []
            user.courses.forEach( (item) => {
                data.push(promiseFindCourse(item));
            });
            Promise.all(data).then( (results) => {
                console.log(results);
                res.render('Courses', {Courses: results});
            });
        }
    });
});

router.get('/CreateCourse', isAuthenticated, isAuthenticatedEmail, (req, res,next) =>{
    res.render('createCourses');
});

// create Course and Upate User
router.post('/CreateCourse', isAuthenticated, async (req, res,next) =>{
    const newCourse = new Course(req.body);
    await newCourse.save();
    User.findOneAndUpdate({_id: req.user._id}, {$push: {courses: newCourse._id} }, (err, doc) => { // hay que verificar si hay error
        console.log(doc);
        res.render('createCourses');
    });
    
});



// Pagina Para enviar el correo de recuperarion de contraseña
router.get('/forgot', (req, res, next) => {
    res.render('forgot');
});

router.post('/forgot', function(req, res, next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done){
            User.findOne({email: req.body.email}, function(err, user){
                if(!user){
                    req.flash('noUserMessage', 'No hay cuenta con esta direccción email');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;           // 1 hour

                user.save(function(err){
                    done(err, token, user);
                });
            });
        },
        function(token, user, done){
            var smtTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'pruebapageweb@gmail.com',
                    pass: 'Gyh$%789'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'pruebapageweb@gmail.com',
                subject: 'Recuperación de contraseña',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtTransport.sendMail(mailOptions, function(err){
                // console.log('mail sent');
                req.flash('recuperacionMessage', 'Un email fue enviado al correo ' + user.email + ' con las instrucciones.');
                done(err, 'done');
            });
        }
        ], function(err){
            if(err) return next(err);
            // console.log('enviado');
            res.redirect('/forgot');
        });
});



// Cambio de contraseña Es importante saber que esto solo funciona despues de de haber enviado el correo 

router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset');
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('/');
                }
                console.log('vamos a cambiarlo')
                user.password = user.encryptPassword(req.body.password);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save();
                done(null, user);
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'pruebapageweb@gmail.com',
                    pass: 'Gyh$%789'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'pruebapageweb@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                console.log('fue cambiado');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});


// este pedazo de aquí es para autenticar el correo de la persona

router.get('/authentication', (req, res, next) => {
    res.render('authenticate');
});

// Aquí se confirma la cuenta por medio del enlace que se envia al correo

router.get('/comfirmation/:token', (req, res,next) => {
    User.findOne({resetAuthenticationToken : req.params.token, resetAuthenticationExpires: { $gt: Date.now() } }, (err, user) => {
        if(!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/');
        }
        console.log('hello')
        user.isAuthenticatedEmail = true;
        user.save((err) => {
            res.redirect('/profile');
        });
    });
});

// Esto es para saber su esta autenticado algun usuario y de esta forma poder dejarlo acceder a la pagina.

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.render('index');
};

// Esto es para saber si el Usuario ya autentico el correo

function isAuthenticatedEmail(req, res, next){
    if(req.user.isAuthenticatedEmail){
        return next();
    }
    res.redirect('/authentication');
};

function promiseFindCourse( id) {
    return new Promise( (fulfill, reject) =>  {
        Course.findById(id, (err, course) => {
            fulfill(course);
        });
    });
};

module.exports = router;