const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    document: String,
    date: Date,
    pais: String,
    departamento: String,
    ciudad: String,
    empresa: String,
    courses: [ ObjectId ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    resetAuthenticationToken: String,
    resetAuthenticationExpires: Date,
    isAuthenticatedEmail: {type: Boolean, default: false}
});

// Encriptamos la constraseña
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Comparar contraseña
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema);