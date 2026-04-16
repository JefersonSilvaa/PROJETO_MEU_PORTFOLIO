/*for(let pos = 0; pos < valores.length ; pos++){
    valores.sort()
    console.log(`A posição ${pos} te o valor ( ${valores[pos]} )`)
} //fomar completa de fazer 
*/

//jeito mais rapido/simplificado de fazer
// consultar se tem elemento dentro da arry [ 'indexOf' (elemento deseja procurar)] 
//valores.indexOf() exemplo
// se tiver sera retornado o valor da key '0,1,2,3....' do elemento, Se não tiver sera retornado valor -1  

let valores = [1,4,2,7,6,9,3,0] 
valores.sort()
valores.push(8)
for(let pos in valores){
    console.log(`A posição ${pos} te o valor ( ${valores[pos]})`)
}