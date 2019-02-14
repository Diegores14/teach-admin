var grammarNumber = /^\d$/
var fieldNumber = document.querySelectorAll('.number')
var charatersSpecial = ['Tab', 'Backspace', 'Enter', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'Shift']

for(var i=0; i<fieldNumber.length; i++) {
    fieldNumber[i].onkeydown = function(event) {
        //console.log(event)
        return charatersSpecial.indexOf(event.key) != -1 || grammarNumber.test(event.key)
    }
}