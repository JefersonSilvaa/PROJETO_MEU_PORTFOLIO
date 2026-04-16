var obj = { //estrutura de objetos pode ser chamado de varievel composta
    nome: "jeferson",
    idade: 29,
    profissao: "programador",
    estarTrabalhando: true,
};
console.log(obj);
console.log(`tipo de informado é (${obj.nome}) == ${typeof obj.nome}`);
console.log(`tipo de informado é (${obj.idade}) == ${typeof obj.idade}`);
console.log(`tipo de informado é '${obj.profissao}' == ${typeof obj.profissao}`);
console.log(`tipo do informado é ${obj.estarTrabalhando} === ${typeof obj.estarTrabalhando}`);

obj.nome = 'matheus';  // pode adcionar novos valores para os objetos dentro de arry

console.log(`Tipo do informado é ${obj.nome} == ${typeof obj.nome}`);

obj.graduacao = true; // pode adcionar novos objetos dentro do arry com (valores ou sem)importante

console.log(obj);

console.log(`tipo do informdo é (${obj.graduacao}) == ${typeof obj.graduacao}`);