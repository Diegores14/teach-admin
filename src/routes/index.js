// aquí vamos a tener el controlador de todas las rutas como de funcionar al momento de un GET y POST

const express = require('express');
const router = express.Router();
const passport = require('passport');
const Course = require('../models/course');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');

// GET para la dirección raiz muestra la pagina principal
router.get('/', (req, res, next) => {
    res.render('index');
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

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
});

router.get('/logout', isAuthenticated, (req, res, next) => {
    req.logout();                                   // cierro la session
    res.redirect('/');
});

router.get('/CreateCourse', isAuthenticated, (req, res,next) =>{
    res.render('createCourses');
});

router.post('/CreateCourse', isAuthenticated, async (req, res,next) =>{
    const newCourse = new Course(req.body);
    newCourse.username = req.user.username;
    console.log(newCourse);
    await newCourse.save();
    res.render('createCourses');
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


// Esto es para saber su esta autenticado algun usuario y de esta forma poder dejarlo acceder a la pagina.

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

module.exports = router;