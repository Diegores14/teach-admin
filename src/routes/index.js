// aquí vamos a tener el controlador de todas las rutas como de funcionar al momento de un GET y POST

const express = require('express');
const router = express.Router();
const passport = require('passport');
const Course = require('../models/course');

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

router.get('/forgot', (req, res, next) => {
    res.render('forgot');
});

router.post('/forgot', (req, res, next) =>{
    
});

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

module.exports = router;