// toLowerCase e toUpperCase

var frase = 'Esta é a frase vamos manipular'

var fraseCaixaAltar = frase.toUpperCase();
var fraseCaixaBaixar = frase.toLowerCase();

console.log(fraseCaixaAltar);
console.log(fraseCaixaBaixar);

console.log(fraseCaixaBaixar.toUpperCase()); // pode modificar

// trim (tira os espaços das informações)

var nomeUsuario = '        bruno      ';
console.log(nomeUsuario);

console.log(nomeUsuario.trim());

// split 

console.log(frase.split(" ")); // tranfomando a frase em um arry!.

// exemplo pratico

var tags = 'PHP, JAVA, JAVASCRIPT, HTML, CSS'

console.log(tags.split(', '));

// lastindexOf

var fraseDois = 'Eu quero a ultima letra desse teste feito aqui no teste '

console.log(fraseDois.indexOf('teste')) // primeria palavras, puxa posição da um espeço antes da letra .

console.log(fraseDois.lastIndexOf('teste')); // aqui sempre a ultima palavra.
