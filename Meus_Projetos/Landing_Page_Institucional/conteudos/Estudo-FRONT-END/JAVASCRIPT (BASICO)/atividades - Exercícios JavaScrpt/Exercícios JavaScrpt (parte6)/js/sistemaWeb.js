let numero = document.querySelector('input#NumeroID')
let tabelaID = document.querySelector('select#tabelaID')
let res = document.querySelector('div.res')
let valores = []

function verificadorNumero(n){       //componetes
    if(Number(n) >= 1 && Number(n) <= 100){
        return true
    } else {
        return false
    }
}

function verificadorTabelaID(n,l){    //componetes
    if (l.indexOf(Number(n)) != -1){
        return true
    } else {
        return false
    }
}

function adicionarNumero(){
    if(verificadorNumero(numero.value) && !verificadorTabelaID(numero.value , valores)){
        valores.push(Number(numero.value))
        let item = document.createElement('option')
        item.text = `Um valor ${numero.value} foi adicionador.`
        tabelaID.appendChild(item)
        res.innerHTML = ''
    } else {
        window.alert('invalidor ou ja encontrado na listar.')
    }
    numero.value = ''
    numero.focus()
}

function finalizar(){
    if(valores.length == 0){
        window.alert('Por favor Adicioner valores na lista abaixo!!!')
    } else {
        let totalElementos = valores.length
        let maiorValor = valores[0]
        let menorValor = valores[0]
        let soma = 0
        let media = 0 

        for (let pos in valores){
            soma += valores[pos]
            if (valores[pos] > maiorValor){
                 maiorValor = valores[pos]
            }  
            if (valores[pos] < menorValor){
                menorValor = valores[pos]
            }
        }
        media = soma / totalElementos

        res.innerHTML = ''
        res.innerHTML += `<p>Ao todo , temos ${totalElementos} números cadastrados</p>`
        res.innerHTML += `<p>O menor valor infomado foi ${menorValor}</p>`
        res.innerHTML += `<p>O maior valor infomado foi ${maiorValor}</p>`
        res.innerHTML += `<p>A soma entre todos os Números são ${soma}</p>`
        res.innerHTML += `<p>media entre todos os valores são ${media} </p>`
    }
}