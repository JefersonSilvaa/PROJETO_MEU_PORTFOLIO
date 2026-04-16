let num = [5,4,3,2]
num.push(8) // colocar na ultima posição
//num[4] = 8 colocar um elemento da posisão dasejada
//num.length quantas elememtos tem contado partir  de "0"
//num.sort() colocar todos os números em ordem do menor para o maior
console.log(`vetor tem ${num.length} posições`)
console.log(num)
console.log(`O primeiro da valor do vetor é ${num[0]}`)
let pos = num.indexOf(5)
if( pos == -1){ 
    console.log('Foi impossivel encontra valor informado!')
} else {
    console.log(`o valor infomado está na posição ${pos}`)
}