var divcaptcha = document.getElementById('divcaptcha')
var formulario = document.getElementById('formulario')
var captcha = document.getElementById('captcha')
var captchacheck = document.getElementById('captchacheck')
var textcaptcha = ''

ajaxGet('/captcha', (err, data) => {
    if(!err) {
        divcaptcha.innerHTML = data
    }
})

ajaxGet('textcaptcha', (err, data) => {
    if(!err) {
        textcaptcha = data
    }
})

formulario.onsubmit = () => {
    var ans = true
    if(textcaptcha != captcha.value) {
        ans = false
        captchacheck.innerHTML = 'No está bien escrito el captcha'
    }
    return ans
}
