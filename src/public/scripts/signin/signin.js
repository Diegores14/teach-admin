// En este archivo iran todos los escripts mas importantes del signin
var password = document.querySelector('#password')
var captcha = document.getElementById('captcha')
var documento = document.getElementById('document')
var formulario = document.getElementById('formulario')
var textcaptcha = ''

function getCaptcha() {
    ajaxGet('/captcha', (err, data) => {
        if(!err){
            var captcha = document.getElementById('divcaptcha')
            captcha.innerHTML = data.substr(0, 5) + "id = \"svgcaptcha\" " + data.substring(5, data.length -1)
        }
        ajaxGet('/textcaptcha', (err, data) => {
            if(!err) {
                textcaptcha = data
            }
        })
    })
}

getCaptcha()

/*captcha.onkeydown = function(event) {
    if(event.key == 'Enter') {
        return false
    } else {
        return true
    }
}*/

formulario.onsubmit = function() {
    var ans = true
    var captcha1 = document.getElementById('captcha').value
    if(textcaptcha != captcha1) {
        ans = false
        console.log('captcha incorrecto ' + textcaptcha + ' ' + captcha1)
        getCaptcha()
        
        captcha.value = ''
    }
    
    if(/^\d+$/.test(documento.value) == false) {
        ans = false
        console.log('no es un documento valido')
    }
    return ans
}