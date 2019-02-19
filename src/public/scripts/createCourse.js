var start = document.getElementById('dateStart')
var end = document.getElementById('dateEnd')
var formulario = document.getElementById('formulario')

var date = new Date()
var hoy = String(date.getFullYear())
if(date.getMonth() + 1 < 10) {
    hoy += '-0' + (date.getMonth() + 1)
} else {
    hoy += '-' + (date.getMonth() + 1)
}
if(date.getDate() < 10) {
    hoy += '-0' + date.getDate()
} else {
    hoy += '-' + date.getDate()
}
start.value = hoy
end.value = hoy 

formulario.onsubmit = function() {
    var ans = true
    var lunes = document.getElementById('1')
    var martes = document.getElementById('2')
    var miercoles = document.getElementById('3')
    var jueves = document.getElementById('4')
    var viernes = document.getElementById('5')
    var sabado = document.getElementById('6')
    var domingo = document.getElementById('7')
    var s = new Date(document.getElementById('dateStart').value)
    var d = new Date(document.getElementById('dateEnd').value)
    var mensaje = ''
    var mensaje1 = ''
    if(d<s) {
        mensaje = 'Por favor organice las fechas del curso.'
        ans = false
    }
    if(lunes.checked) {
        var i = Number(document.getElementById('LunesI').value)
        var f = Number(document.getElementById('LunesF').value)
        if(i>=f) {
            mensaje1 = 'Organice el horario.'
            ans = false
        }
    }
    if(martes.checked) {
        var i = Number(document.getElementById('MartesI').value)
        var f = Number(document.getElementById('MartesF').value)
        if(i>=f) {
            mensaje1 = 'Organice el horario.'
            ans = false
        }
    }
    if(miercoles.checked) {
        var i = Number(document.getElementById('MiercolesI').value)
        var f = Number(document.getElementById('MiercolesF').value)
        if(i>=f) {
            mensaje1 = 'Organice el horario.'
            ans = false
        }
    }
    if(jueves.checked) {
        var i = Number(document.getElementById('JuevesI').value)
        var f = Number(document.getElementById('JuevesF').value)
        if(i>=f) {
            mensaje1 = 'Organice el horario.'
            ans = false
        }
    }
    if(viernes.checked) {
        var i = Number(document.getElementById('ViernesI').value)
        var f = Number(document.getElementById('ViernesF').value)
        if(i>=f) {
            mensaje1 = 'Organice el horario.'
            ans = false
        }
    }
    if(sabado.checked) {
        var i = Number(document.getElementById('SabadoI').value)
        var f = Number(document.getElementById('SabadoF').value)
        if(i>=f) {
            mensaje1 = 'Organice el horario.'
            ans = false
        }
    }
    if(domingo.checked) {
        var i = Number(document.getElementById('DomingoI').value)
        var f = Number(document.getElementById('DomingoF').value)
        if(i>=f) {
            mensaje1 = 'Organice el horario.'
            ans = false
        }
    }
    if(!ans) {
        alert(mensaje + '\n' + mensaje1)
    }
    return ans
}