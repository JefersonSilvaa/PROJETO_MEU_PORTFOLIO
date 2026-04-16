// metodos em objetos JS
let pessoa = {
    nome: 'Mateus',
    idade: 29,
    falar: function(){
        console.log('olá, como você estar ?')
    },
    soma: function(a,b){
        return a + b;
    },
};

pessoa.falar();

var soma = pessoa.soma(2,1);

console.log(soma);
