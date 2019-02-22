var gramarName = /^[a-zA-Z ]$/
var special = [ 'Backspace', 'Tab', 'Enter', 'shift', 'CapsLock',
                 'ArrowUP', 'ArrowDown', 'ArrowRight', 'ArrowLeft']


function validationName(event) {
    console.log(event.key)
    if(this.value == '' && event.key == ' ') {
        return false
    }
    if(gramarName.test(event.key) == false && special.indexOf(event.key) == -1) {
        return false
    }
    return true
}
function validationEspace(event) {
    if(this.value == ' ') {
        this.value = ''
    }
}

function generateValidationName(id) {
    var element = document.getElementById(id)
    element.onkeydown = validationName
    element.onkeyup = validationEspace
}