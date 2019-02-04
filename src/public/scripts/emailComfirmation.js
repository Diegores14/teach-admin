var fieldEmail = document.querySelector('#email')
var grammarEmail = /^[\w_\.]+@[\w_]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2})?$/i

fieldEmail.addEventListener('keydown', (event) => {
  console.log(grammarEmail.test(fieldEmail.value + event.key))
})
