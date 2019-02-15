// aquí vamos a tener el controlador de todas las rutas como debe funcionar al momento de un GET y POST

const express = require('express')
const router = express.Router()
const path = require('path')
const passport = require('passport')
const Course = require('../models/course')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const async = require('async')
const CoEsCi = require('country-state-city')
const multer = require('multer')
const uploadDocent = multer({ dest: path.resolve('src/public/img/Users/') })
const uploadStudent = multer({ dest: path.resolve('src/public/img/Students/') })
const fs = require('fs')
const svgCaptcha = require('svg-captcha')
const STUDENT = require('../models/student')

// GET para la dirección raiz muestra la pagina principal
router.get('/', isAuthenticated, isAuthenticatedEmail, (req, res, next) => {
  res.render('profile')
})

// GET para Obtener el signup (registro)
router.get('/signup', (req, res, next) => {
  res.render('signup')
})

// Post para obtener todos los datos al momento de registro
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  passReqToCallback: true
}))

// GET Obtener la pagina de Ingreso (singin)
router.get('/signin', (req, res, next) => {
  res.render('signin')
})

// POST para obtener los datos de ingreso
router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  passReqToCallback: true
}))

/*
router.use((req, res, next) => {
    isAuthenticated(req, res, next);
    next();
});
*/

router.get('/profile', isAuthenticated, isAuthenticatedEmail, isComplete, (req, res, next) => {
  const user = req.user
  res.render('profile', { user })
})

// aquí va ha retornar un formato json para poder llenar los selct en el html
router.get('/countries', (req, res, next) => {
  res.json(CoEsCi.getAllCountries())
})

router.get('/states/:token', (req, res, next) => {
  res.json(CoEsCi.getStatesOfCountry(req.params.token))
})

router.get('/city/:token', (req, res, next) => {
  res.json(CoEsCi.getCitiesOfState(req.params.token))
})

router.get('/completarUsuario', isAuthenticated, isAuthenticatedEmail, (req, res, next) => {
  const user = req.user
  res.render('CompletarRegistro', { user })
})

router.get('/updateUser', isAuthenticated, isAuthenticatedEmail, isComplete, (req,res,next) => {
  const user = req.user
  res.render('updateUser',{ user })
})

router.get('/listStudent', isAuthenticated, isAuthenticatedEmail, isComplete, (req,res,next) => {
  const user = req.user
  res.render('listStudent',{ user })
})

router.get('/adminClass', isAuthenticated, isAuthenticatedEmail, isComplete, (req,res,next) => {
  const user = req.user
  var courseName = ""
  Course.findOne({cod :req.query.cod}, function (err, course) {
        if (!course) {
          req.flash('noUserMessage', 'No existe un curso')
          return res.redirect('/courses')
        }
        courseName = course.name
        console.log(req.query.cod)
        console.log(courseName)
        res.render('adminClass',{ user , course})
      })
})

router.get('/editCourses', isAuthenticated, isAuthenticatedEmail, isComplete, (req,res,next) => {
  const user = req.user
  var courseName = ""
  Course.findOne({cod :req.query.cod}, function (err, course) {
        if (!course) {
          req.flash('noUserMessage', 'No existe un curso')
          return res.redirect('/courses')
        }
        courseName = course.name
        console.log(req.query.cod)
        console.log(courseName)
        res.render('editCourses',{ user , course})
      })
})

// get captcha
router.get('/captcha', (req, res) => {
  var captcha = svgCaptcha.create( {color: true, size: 5})
  req.session.captcha = captcha.text
  res.send(captcha.data)
})

router.get('/textcaptcha', (req, res) => {
  res.send(req.session.captcha)
})

router.post('/completarUsuario', isAuthenticated, isAuthenticatedEmail, uploadDocent.single('avatar'), (req, res, next) => {
  if (req.file) {
    var ext = path.extname(req.file.originalname)
    fs.renameSync(path.join(req.file.destination, req.file.filename),
    path.join(req.file.destination, req.file.filename) + ext)
    req.body['photo'] = req.file.filename + ext
  }
  req.body['isCompleteProfile'] = true
  req.body.date = new Date(req.body.date)
  User.findByIdAndUpdate(req.user._id, req.body, (err, doc) => {
    if (err) { 
      console.log(err)
    } else {
      res.redirect('/profile')
    }
  })
})

router.get('/logout', isAuthenticated, (req, res, next) => {
  req.logout() // cierro la session
  res.redirect('/')
})

// Course
router.get('/courses', isAuthenticated, isAuthenticatedEmail, isComplete, (req, res, next) => {
  // cargar los cursos, falta poner eso
  User.findById(req.user._id, (err, user) => {
    if (!err) {
      let data = []
      user.courses.forEach((item) => {
        data.push(promiseFindCourse(item))
      })
      Promise.all(data).then((results) => {
        res.render('Courses', { Courses: results })
      })
    }
  })
})

router.get('/CreateCourse', isAuthenticated, isAuthenticatedEmail, isComplete, (req, res, next) => {
  res.render('createCourses', req.user)
})

// create Course and Upate User
router.post('/CreateCourse', isAuthenticated, async (req, res, next) => {
  req.body['duration'] = { start : Date(req.body.dateStart), end : Date(req.body.dateEnd) }
  const newCourse = new Course(req.body)
  await newCourse.save()
  User.findOneAndUpdate({ _id: req.user._id }, { $push: { courses: newCourse._id } }, (err, doc) => { // hay que verificar si hay error
    console.log(doc)
    res.render('createCourses')
  })
})

// Pagina Para enviar el correo de recuperarion de contraseña
router.get('/forgot', (req, res, next) => {
  res.render('forgot')
})

router.post('/forgot', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex')
        done(err, token)
      })
    },
    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          req.flash('noUserMessage', 'No hay cuenta con esta direccción email')
          return res.redirect('/forgot')
        }

        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

        user.save(function (err) {
          done(err, token, user)
        })
      })
    },
    function (token, user, done) {
      var smtTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'pruebapageweb@gmail.com',
          pass: 'Gyh$%789'
        }
      })
      var mailOptions = {
        to: user.email,
        from: 'pruebapageweb@gmail.com',
        subject: 'Recuperación de contraseña',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      smtTransport.sendMail(mailOptions, function (err) {
        // console.log('mail sent');
        req.flash('recuperacionMessage', 'Un email fue enviado al correo ' + user.email + ' con las instrucciones.')
        done(err, 'done')
      })
    }
  ], function (err) {
    if (err) return next(err)
    // console.log('enviado');
    res.redirect('/forgot')
  })
})

// Cambio de contraseña Es importante saber que esto solo funciona despues de de haber enviado el correo

router.get('/reset/:token', function (req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.')
      return res.redirect('/forgot')
    }
    res.render('reset')
  })
})

router.post('/reset/:token', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.')
          return res.redirect('/')
        }
        console.log('vamos a cambiarlo')
        user.password = user.encryptPassword(req.body.password)
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()
        done(null, user)
      })
    },
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'pruebapageweb@gmail.com',
          pass: 'Gyh$%789'
        }
      })
      var mailOptions = {
        to: user.email,
        from: 'pruebapageweb@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      }
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('success', 'Success! Your password has been changed.')
        console.log('fue cambiado')
        done(err)
      })
    }
  ], function (err) {
    res.redirect('/')
  })
})

// este pedazo de aquí es para autenticar el correo de la persona

router.get('/authentication', (req, res, next) => {
  res.render('authenticate')
})

// Aquí se confirma la cuenta por medio del enlace que se envia al correo

router.get('/comfirmation/:token', (req, res, next) => {
  User.findOne({ resetAuthenticationToken: req.params.token, resetAuthenticationExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.')
      return res.redirect('/')
    }
    console.log('hello')
    user.isAuthenticatedEmail = true
    user.save((err) => {
      req.logout() // cierro la session
      res.redirect('/')
    })
  })
})

router.get('/createstudent', isAuthenticated, isAuthenticatedEmail, isComplete, (req, res, next) => {
  var user = req.user
  res.render('createStudent', user)
})

router.post('/createstudent', isAuthenticated, isAuthenticatedEmail, isComplete, uploadStudent.single('avatar'), (req, res, next) => {
  STUDENT.findOne({ Codigo : req.body.Codigo, idDocent : req.user._id }, async (err, student) => {
    if(!err) {
      if(!student) {
        student = new STUDENT()
        student.firstName = req.body.firstName
        student.Codigo = req.body.Codigo
        student.lastName = req.body.lastName
        student.email = req.body.email
        student.idDocent = req.user._id
        await student.save()
        User.findByIdAndUpdate(req.user._id, {$push: { students: student._id} }, (err, doc) => {
        })
      }
    } else {
      console.log(err)
    }
  })
  res.redirect('/createstudent')
})

// Esto es para saber su esta autenticado algun usuario y de esta forma poder dejarlo acceder a la pagina.

function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.render('index')
};

// Esto es para saber si el Usuario ya autentico el correo

function isAuthenticatedEmail (req, res, next) {
  if (req.user.isAuthenticatedEmail) {
    return next()
  }
  res.redirect('/authentication')
};

function promiseFindCourse (id) {
  return new Promise((fulfill, reject) => {
    Course.findById(id, (err, course) => {
      fulfill(course)
    })
  })
};

function isComplete(req, res, next){
  if(req.user.isCompleteProfile){
    return next()
  }
  res.redirect('/completarUsuario')
}


module.exports = router
