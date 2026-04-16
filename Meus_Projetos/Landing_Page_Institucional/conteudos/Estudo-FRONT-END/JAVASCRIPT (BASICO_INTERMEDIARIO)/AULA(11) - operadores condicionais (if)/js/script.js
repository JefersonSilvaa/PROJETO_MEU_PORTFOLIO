var idadeCrianca = 13
var idadeAdolecente = 17
var idadeJovem = 18
var idadeAdulto = 30

var idade = 30

if(idade <= idadeCrianca){
    console.log(`voce é uma criança`)
} 

if(idade < idadeJovem && idade > idadeCrianca){
    console.log(`voce é um adolecente`)
}

if(idade > idadeCrianca && idade < idadeAdulto && idade > idadeAdolecente){
    console.log(`voce é um jovem`)
}

if(idade >= idadeAdulto){
    console.log(`você é um adulto`)
}