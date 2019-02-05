var pais = document.getElementById('pais')
var state = document.getElementById('state')
var city = document.getElementById('city')
var idState = 0;

window.onload = function() {
    ajaxGet('http://localhost:3000/countries', (err, data)=>{
        if(!err) {
            data = JSON.parse(data)
            for(var i = 0; i<data.length; i++) {
                var option = document.createElement('option')
                option.text = data[i].name
                pais.add(option, data[i].id)
            }
        }
    })
}

pais.onchange = function(){
    state.length = 1
    city.length = 1
    if(this.selectedIndex < 1)
        return;
    ajaxGet('http://localhost:3000/states/' + this.selectedIndex, (err, data)=>{
        if(!err) {
            data = JSON.parse(data)
            idState = Number(data[0].id)
            for(var i = 0; i<data.length; i++) {
                var option = document.createElement('option')
                option.text = data[i].name
                state.add(option)
            }
        }
    })
}

state.onchange = function(){
    city.length = 1
    if(this.selectedIndex < 1)
        return;
    var token = Number(this.selectedIndex) + idState - 1
    ajaxGet('http://localhost:3000/city/' + token, (err, data)=>{
        if(!err) {
            data = JSON.parse(data)
            for(var i = 0; i<data.length; i++) {
                var option = document.createElement('option')
                option.text = data[i].name
                city.add(option, data[i].id)
            }
        }
    })
}