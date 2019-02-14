var fieldEmail = document.getElementById('email')
var labelEmailcheck = document.getElementById('emailcheck')
var grammarEmail = /^[\w_\.]+@[\w_]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2})?$/i

fieldEmail.onkeydown = function (event) {
  if(event.key != 'Enter' && event.key != 'Tab') {
    if(grammarEmail.test(this.value + event.key)) {
      labelEmailcheck.innerHTML = ''
    } else {
      labelEmailcheck.innerHTML = 'Correo no valido'
    }
  } else {
    if(grammarEmail.test(this.value)) {
      labelEmailcheck.innerHTML = ''
    } else {
      labelEmailcheck.innerHTML = 'Correo no valido'
    }
  }
}
