// splice
var arr = [1,2,3,4,5];//adcionar um elemento no meio do de arry.
// 1- indice do elemento , 2- quantidade sera removido para colocar no meio , 3- colocar que sera adicionado.
arr.splice(2, 0, 999);
console.log(arr);

//splice part 2
arr.splice(2,1) //pode remove elemento que quiser apartir do indice indicado.
console.log(arr);

//indexOf
console.log(arr.indexOf(5));

//join
var arr2 = ["O","rato","roeu","a","roupa","roupa"];
console.log(arr2.join(" ")); //obs: transforma arr em string.

//reverse
//obs: inverte um arr.
console.log(arr2.reverse());
console.log(arr.reverse());