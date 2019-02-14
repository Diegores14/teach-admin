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
        }
    })
    
    ajaxGet('/textcaptcha', (err, data) => {
        if(!err) {
            textcaptcha = data
        }
    })
}

getCaptcha()

captcha.onkeydown = function(event) {
    if(event.key == 'Enter') {
        return false
    } else {
        return true
    }
}

formulario.onsubmit = () => {
    var ans = true
    if(textcaptcha != captcha.value) {
        ans = false
        getCaptcha()
        captcha.value = ''
        captchacheck.innerHTML = 'No está bien escrito el captcha'
    }
    if(grammarEmail.test(fieldEmail.value) == false) {
        ans = false
    }
    if(/[a-z]/.test(this.value + event.key) == false) {
        ans = false
    }
    if(/[A-Z]/.test(this.value + event.key) == false) {
        ans = false
    }
    if(/[\d\.\#\$\%\&-]/.test(this.value + event.key) == false) {
        ans = false
    }
    return ans
}
