var labelpasswordcheck = document.getElementById('passwordcheck')
var grammarcharater = /^[\w\.\#\$\%\&-]$/
var fieldpassword = document.getElementById('password')

fieldpassword.onkeydown = function(event) {
    if(charatersSpecial.indexOf(event.key) == -1){
        var text = ''
        if(/[a-z]/.test(this.value + event.key) == false) {
            text += 'No tiene miniscula. '
        }
        if(/[A-Z]/.test(this.value + event.key) == false) {
            text += 'No tiene mayuscula. '
        }
        if(/[\d\.\#\$\%\&-]/.test(this.value + event.key) == false) {
            text += 'No tiene numeros o caracteres especiales. '
        }
        labelpasswordcheck.innerHTML = text
    }
    return charatersSpecial.indexOf(event.key) != -1 || grammarcharater.test(event.key)
}