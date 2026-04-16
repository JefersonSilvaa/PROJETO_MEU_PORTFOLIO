function primeriaFuncao(){
    console.log(`hello wordl das Funções!!`);
}
primeriaFuncao();

//////

function dizerNome(nome){ // componete reutilizaveis (se chamar tambem de uma Função);
    //chamada para API
    console.log('O nome é :' + nome);
}
dizerNome('jeff');
dizerNome('Mateus');
dizerNome('bruno');

var nomeBancoDeDados = 'lucas' // seria chamada de nome para banco de dados.

dizerNome(nomeBancoDeDados);

////////

//somar de dois números criando uma função
function soma(a,b){
    var soma = a + b
    return soma;
}; // componete(ou uma função);

var somaUm = soma(2,5); // armazernar um valor(ou resebe um valor) e fazer uma chamada para uma função do sistema para uma determinada função desejada deve ser crianda ou existe no sistema.
console.log(somaUm); // retorno do sistema
console.log(soma(5,5)); // pode faze direto em JS.

var somaDois = soma(10,2);
console.log(somaDois);