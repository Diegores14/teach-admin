var grammarcharater = /^[\w\.\#\$\%\&-]$/
var fieldpassword = document.querySelectorAll('.password')
var charatersSpecial = ['Backspace', 'Enter']

for(var i=0; i<fieldpassword.length; i++) {
    fieldpassword[i].onkeydown = function(event) {
        return charatersSpecial.indexOf(event.key) != -1 || grammarcharater.test(event.key)
    }
}