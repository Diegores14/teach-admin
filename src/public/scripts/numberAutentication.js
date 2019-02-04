var grammarNumber = /^\d$/
var fieldNumber = document.querySelectorAll('.number')
var charatersSpecial = ["Backspace", "Enter", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"]

for(var i=0; i<fieldNumber.length; i++) {
    fieldNumber[i].onkeydown = function(event) {
        return charatersSpecial.indexOf(event.key) != -1 || grammarNumber.test(event.key)
    }
}