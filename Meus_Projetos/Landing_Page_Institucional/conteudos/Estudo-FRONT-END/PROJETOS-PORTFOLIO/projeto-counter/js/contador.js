//ligação dos dados
var numeroContador = document.querySelector('p#numeroContador') // local da respostar
var cornumeroContador = document.querySelector('p#numeroContador') // cor do contador
var numero = 0

function Decresente(){
     if(numero >= 0 || numero <= 0){
        numero += -1
        numeroContador.innerHTML = `${numero}` 
        if(numero <= -1){
            cornumeroContador.style.color = 'red'
        }
     }
}

function reset(){
    if(numero >= 0 || numero <= 0){
        numero = 0
        numeroContador.innerHTML = `${numero}`
        if(numero == 0){
            cornumeroContador.style.color = 'white'
        }
    }
}

function adcionar(){
    if(numero <= 0 || numero >= 0 ){
        numero += 1
        numeroContador.innerHTML = `${numero}`
        if(numero >= 1){
            cornumeroContador.style.color = 'darkgreen'
        }
    } 
}