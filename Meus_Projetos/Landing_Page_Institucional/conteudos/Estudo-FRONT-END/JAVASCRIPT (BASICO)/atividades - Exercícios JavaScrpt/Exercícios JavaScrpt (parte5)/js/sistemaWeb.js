 function Tabuada(){
    let numero = Number(document.querySelector('input#numeroId').value)
    let tab = document.querySelector('select#selectId')

    if(numero == 0){
        window.alert('[ERRO] Por favor informe um Número!!')
    } else{
        tab.innerHTML = ''
        for(let c = 1; c <= 10 ; c++){
            let item = document.createElement('option');
            item.text = `${numero} x ${c} = ${numero*c}`
            tab.appendChild(item)
        }
    }
}