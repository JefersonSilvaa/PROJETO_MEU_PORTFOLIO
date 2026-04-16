for(var i = 0;i <= 10; i++){ // variavel ; condição ; atribuição.
    console.log(`Repetindo for: ${i}`)
};

var arr = [1,2,3,4,5,6];

for(var j = 0; j < arr.length; j++){ // variavel ; condição ; atribuição.
    console.log(`Repetindo pela quantidade de elementos do arr > ${j}`)
    console.log(arr[j])
}

console.log(arr.length + ' elementos do arr')

for(var x = 5;x < 100; x *= 3){ // x = 5; x < 100 ;x = 5 * 3
    console.log(x)
}