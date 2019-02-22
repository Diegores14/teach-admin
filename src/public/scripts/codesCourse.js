var gramarCode = /^[\w]$/

function validationCodeCourse(event) {
    console.log(event.key)
    if(this.value == '' && event.key == ' ') {
        return false
    }
    if(gramarCode.test(event.key) == false && special.indexOf(event.key) == -1) {
        return false
    }
    return true
}

function generateValidationCode(id) {
    var element = document.getElementById(id)
    element.onkeydown = validationCodeCourse
}