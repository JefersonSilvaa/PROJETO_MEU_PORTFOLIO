//DESTRUCTURING com arrys
let arr = [1, 2, 3, 4, 5, 6, 7];
let [num1, num2, num3, num4] = arr;

console.log(num1)
console.log(num2)
console.log(num3)
console.log(num4)

//com objetos
const pessoa = {
    nome: "matheus",
    profissao: "programador",
    idade: 28,
};

let { nome: nomeVar, profissao: profissaoVar, idade: idadeVar } = pessoa;
console.log(nomeVar)
console.log(profissaoVar)
console.log(idadeVar)
