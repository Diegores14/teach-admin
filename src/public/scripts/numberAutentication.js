var grammarNumber = /^\d$/
var fieldNumber = document.querySelectorAll('.number')

for(var i=0; i<fieldNumber.length; i++) {
    fieldNumber[i].onkeydown = function(event) {
        return grammarNumber.test(event.key)
    }
}