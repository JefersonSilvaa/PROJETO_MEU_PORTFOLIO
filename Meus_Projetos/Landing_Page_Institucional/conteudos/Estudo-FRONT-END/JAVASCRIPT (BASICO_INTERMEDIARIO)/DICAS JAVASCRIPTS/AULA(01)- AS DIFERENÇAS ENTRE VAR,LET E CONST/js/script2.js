// var,let e cosnt
/*
O 'let' funcionar como varivel local dentro do mesmo bloco (Atenção)
exemplo:
1 - estruturas de repetições
2 - function
3 - tudo que tiver bloco

Um bloco é representado por
nome {
    (bloco)
}
*/ 

let nome = 'caio'
function mostrarNome(){
    let nome = 'jeff'
    console.log(`${nome}`)

    for(n = 1;n <= 10 ;n++){
        let nome = 'bruno'
        console.log(`${nome}`)
    }
}
mostrarNome()
console.log(`${nome}`)