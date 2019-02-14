const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;       // para diferentes tipos de autenticacion lo llama strategy
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const request = require('request') 

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({                 // definir el metodo de autenticación.
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) =>{

    //verificaion captcha inicio
    if(
        req.body['g-recaptcha-response'] === undefined ||
        req.body['g-recaptcha-response'] === '' ||
        req.body['g-recaptcha-response'] === null
        ){
        return done(null, false, req.flash('signupMessage', 'Fail captcha solve.'));
        }

    // secure key
    const secretKey = '6LfAY48UAAAAANdMjqpBQdhmiprsc609BdrPLuxI';   

    //verify url
    const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
    //make request to veridy url

    request(verifyURL, async (err, response,body) => {
        body = JSON.parse(body);
        
        //if not successful
        if(body.success !== undefined && !body.success){
            return done(null, false, req.flash('signupMessage', 'Fail captcha solve.'));
        }

        // if success
    })
    //verificacion captcha final
    const user = await User.findOne({username: username});
    const user1 = await User.findOne({document: req.body.document});
    const user2 = await User.findOne({email: req.body.email});
    if(user || user1 || user2){
        // console.log(user);
        return done(null, false, req.flash('signupMessage', 'El usuario ya existe.'));
    }else{
        const newUser = new User();
        newUser.username = username;
        newUser.password = newUser.encryptPassword(password);
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        newUser.email = req.body.email;
        newUser.document = req.body.document
        newUser.date = new Date(1900, 00, 01, 0, 0, 0, 0);
        newUser.pais = "";
        newUser.departamento = "";
        newUser.ciudad = "";
        newUser.empresa = "";
        newUser.photo = "profile.png"
        
        // console.log(newUser);
        var token = crypto.randomBytes(20).toString('hex');
        newUser.resetAuthenticationToken = token;
        newUser.resetAuthenticationExpires = Date.now() + 86400000; // 1 dia;
        var smtTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'pruebapageweb@gmail.com',
                pass: 'Gyh$%789'
            }
        });
        var mailOptions = {
            to: newUser.email,
            from: 'pruebapageweb@gmail.com',
            subject: 'Comfirmar Cuenta',
            text: 'You are receiving this because you (or someone else) have requested the confirmation  of email for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/comfirmation/' + token + '\n\n' +
            'If you did not request this, please ignore this email.\n'
        };
        smtTransport.sendMail(mailOptions);
        await newUser.save();
        done(null, newUser);
    }
}));

// Aquí se hace toda la autenticacion del signin
passport.use('local-signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //verificaion captcha inicio
    if(
        req.body['g-recaptcha-response'] === undefined ||
        req.body['g-recaptcha-response'] === '' ||
        req.body['g-recaptcha-response'] === null
        ){
        return done(null, false, req.flash('signinMessage', 'Fail captcha solve.'));
        }

    // secure key
    const secretKey = '6LfAY48UAAAAANdMjqpBQdhmiprsc609BdrPLuxI';   

    //verify url
    const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
    //make request to veridy url

    request(verifyURL, async (err, response,body) => {
        body = JSON.parse(body);
        
        //if not successful
        if(body.success !== undefined && !body.success){
            return done(null, false, req.flash('signinMessage', 'Fail captcha solve.'));
        }

        // if success
    })
    //verificacion captcha final
    const user = await User.findOne({document: req.body.document, username: username});
    if(!user) {
        return done(null, false, req.flash('signinMessage', 'usuario o contraseña incorrecta.'));
    }else{
        if(!user.comparePassword(password)){
            return done(null, false, req.flash('signinMessage', 'usuario o contraseña incorrecta.'));
        }else{
            done(null, user);
        }
    }
}));