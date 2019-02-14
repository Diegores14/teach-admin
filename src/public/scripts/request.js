
function ajaxGet(url, callback) {
    var req = new XMLHttpRequest()
    req.open("Get", url, true)
    req.addEventListener("load", () => {
        if(req.status >= 200 && req.status < 400 ){
            callback(null, req.responseText)
        } else {
            callback(req.status + " " + req.statusText)
        }
    })
    req.addEventListener("error", () => {
        callback("Error de red")
    })
    req.send(null)
}