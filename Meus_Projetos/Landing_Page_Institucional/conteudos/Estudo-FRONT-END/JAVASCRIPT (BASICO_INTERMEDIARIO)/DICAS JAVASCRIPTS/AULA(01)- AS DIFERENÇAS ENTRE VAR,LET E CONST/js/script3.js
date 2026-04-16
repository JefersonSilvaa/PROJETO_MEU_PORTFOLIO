// var,let e cosnt
/* 
A 'const', ela funcionar como uma variavel que não pode mudar seu valor!
const server valor não vão mudar 
exemples:
1 - funtion de botoes de abrir e fechar de site
2 - dispara uma animação qunado uma derteminada ação for feita 
*/

const nomeAluno = 'lucas'

function mostrarNome(){
    const nomeAluno = 'jeff'
    console.log(`${nomeAluno}`)
}
mostrarNome()
console.log(`${nomeAluno}`)