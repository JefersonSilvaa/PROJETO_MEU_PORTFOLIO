var idade = 73

console.log(`Você tem ${idade} anos.`)
if(idade < 16){
    console.log(`Não vota`)
} else if (idade < 18 || idade >= 65){             // if(idade >= 16 && idade < 18){
     console.log('voto opcional')
} else{                                            // else if (idade >= 18){
    console.log('Voto obrigatorio')
}