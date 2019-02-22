var divcaptcha = document.getElementById('divcaptcha')
var formulario = document.getElementById('formulario')
var captcha = document.getElementById('captcha')
var captchacheck = document.getElementById('captchacheck')
var textcaptcha = ''

function getCaptcha() {
    ajaxGet('/captcha', (err, data) => {
        if(!err){
            var captcha = document.getElementById('divcaptcha')
            captcha.innerHTML = data.substr(0, 5) + "id = \"svgcaptcha\" " + data.substring(5, data.length -1)
            ajaxGet('/textcaptcha', (err, data) => {
                if(!err) {
                    textcaptcha = data
                }
            })
        }
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

formulario.onsubmit = () => {
    var ans = true
    var captcha1 = document.getElementById('captcha')
    if(textcaptcha != captcha1.value) {
        ans = false
        getCaptcha()
        captcha.value = ''
        captchacheck.innerHTML = 'No está bien escrito el captcha'
    }
    if(grammarEmail.test(fieldEmail.value) == false) {
        ans = false
    }
    if(/[a-z]/.test(fieldpassword.value) == false) {
        ans = false
    }
    if(/[A-Z]/.test(fieldpassword.value) == false) {
        ans = false
    }
    if(/[\d\.\#\$\%\&-]/.test(fieldpassword.value) == false) {
        ans = false
    }
    return ans
}
