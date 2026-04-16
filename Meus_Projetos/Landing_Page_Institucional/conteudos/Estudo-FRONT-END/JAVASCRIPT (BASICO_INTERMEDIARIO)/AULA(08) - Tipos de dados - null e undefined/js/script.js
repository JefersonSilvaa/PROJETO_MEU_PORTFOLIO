//Hoisting == içamento - leva todas as variaveis para topo do codigo mesmo estando no final 
console.log(sobreNome)

var nome = null; // objeto não definido
var sobreNome; //valor não definido 

console.log(console.log(`Tipo de dados como: (${nome}) == ${typeof nome}`))
console.log(`Tipo de dados como: (${sobreNome}) == ${typeof sobreNome}`)