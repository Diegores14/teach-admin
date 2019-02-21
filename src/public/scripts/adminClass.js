var percentage = document.getElementById('percentage');
var formulario = document.getElementById('formulario');
var number = /\d/;
var charatersSpecial = ['Tab', 'Backspace', 'Enter', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'Shift'];
var duration = {}
ajaxGet('/api/getdatecourse', (err, data) => {
    if(!err) {
        duration = JSON.parse(data)
        duration.start = new Date(duration.start)
        duration.end = new Date(duration.end)
    }
})

percentage.onkeydown = function(event) {
    return number.test(event.key) || event.key == '.' || charatersSpecial.indexOf(event.key) != -1;
}

function verification() {
    var date = document.getElementById('date').value;
    var p = document.getElementById('percentage').value;
    var grammar = /^\d+(\.\d+)?$/;
    var ans = true;
    var mensaje = '';
    if(grammar.test(p) == false) {
        ans = false;
        mensaje = 'No está bien diligenciado el porcentaje';
    } else {
        if(Number(p) > 100) {
            ans = false;
            mensaje = 'el porcentaje tiene que ser menor que 100';
        }
    }
    var date1 = new Date(date)
    date1.setDate(date1.getDate() + 1);
    if(date1 < duration.start || duration.end < date1) {
        ans = false;
        mensaje += '\nLa fecha no es valida';
    }
    if(!ans) {
        alert(mensaje);
    }
    return ans;
}

formulario.onsubmit = verification;