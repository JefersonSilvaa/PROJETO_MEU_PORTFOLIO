// parsetFloat 10.0 

console.log(parseFloat('12.222') + ' number '); // transfomar number numbar "ponto flutuante".
console.log(Number.parseFloat('12.222') + ' number '); // utilizando 'Number.parseFloat'.

// parseint 10.1212 vai para "10".

console.log(parseInt('10') + ' number '); // transfoma um number inteiro .
console.log(parseInt(10.223) + ' number '); // transforma um number inteiro .

// toFixed limita as casa decimais de um número

console.log(23.999232323.toFixed(1)); // escolher limite das casa decimais! .
console.log(23.999232323.toFixed(3)); // escolher limite das casa decimais! .

// isNaN  verificar se valor Não é um número, Se for sera retornado 'false' se não 'true' .

console.log(isNaN("teste")); // Não é um número!
console.log(isNaN("14")); // É um número! Porque ele converte em number(atencão)
console.log(isNaN(14)); // É um número!\

// MAX_VALUE e MIN_VALUE ( max e min que JS aceita , se for maior que limete será Infinity!, se for menos será mini-Infinity)

console.log(Number.MAX_VALUE);
console.log(Number.MIN_VALUE);

console.log(3.7976931348623157e+308); // Se fomar maior tera valor de Infinity.