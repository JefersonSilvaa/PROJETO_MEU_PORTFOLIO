//length 
var arr = [1,2,3,4,5,6,7,8,9];
console.log(arr.length); //saber quantos elemontos tem num arr!

//push 
arr.push(6); //adcionar um elemento no final de arr!
arr.push('Qualquer coisa adcionada!');
console.log(arr);
console.log(arr.length);

//pop 
arr.pop(); //remove o elemento do final do arr!
console.log(arr);

//unshift 
arr.unshift(0); //adcionar no começo do arr!
arr.unshift('teste');
console.log(arr);

//shift 
arr.shift(); //remove o primeiro elemento do arr!
console.log(arr);

//acessar o último elemento de arr!
console.log(arr[arr.length - 1]);

//isArray 
console.log(Array.isArray(5)); //verificar se é um Array o que estamos trabalhando!
console.log(Array.isArray(arr));