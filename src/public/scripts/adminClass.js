var percentage = document.getElementById('percentage')
var formulario = document.getElementById('formulario')
var number = /\d/
var charatersSpecial = ['Tab', 'Backspace', 'Enter', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'Shift']

percentage.onkeydown = function(event) {
    return number.test(event.key) || event.key == '.' || charatersSpecial.indexOf(event.key) != -1
}

formulario.onsubmit = function() {
    var p = document.getElementById('percentage').value
    var grammar = /^\d+(\.\d+)?$/
    var ans = true
    var mensaje = ''
    if(grammar.test(p) == false) {
        ans = false
        mensaje = 'No está bien diligenciado el porcentaje'
    } else {
        if(Number(p) > 100) {
            ans = false
            mensaje = 'el porcentaje tiene que ser menor que 100'
        }
    }
    if(!ans) {
        alert(mensaje)
    }
    return ans
}