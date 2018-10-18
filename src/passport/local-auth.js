const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;       // para diferentes tipos de autenticacion lo llama strategy
const User = require('../models/user');

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
    const user = await User.findOne({username: username});
    if(user){
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
        // console.log(newUser);
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