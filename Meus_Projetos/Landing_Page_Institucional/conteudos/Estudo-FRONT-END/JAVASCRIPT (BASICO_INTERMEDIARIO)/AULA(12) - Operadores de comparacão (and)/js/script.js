var IdadeUsuario = 18
var andarCarro = 'abilitação'
var nomeUsuario = 'matheus'
var paisOrigem = 'Brasil'

if(IdadeUsuario < 18){
    console.log(`você infelizmente ainda não possuir idade minima permitida para tira 'abilitação'`)
} else if(IdadeUsuario >= 18){
    console.log(`Parabens você ja pode tira sua abilitacão`)
    // var paisOrigem = 'Argentina'
    if( paisOrigem != 'Brasil'){
        console.log(`infelizmente, você estrangeiro aqui no (Brasil)`)
        console.log(`Seja bem-vindo ${nomeUsuario}, ao Brasil!!!`)
    } else {
        console.log(`Você ja possuir uma ${andarCarro} aqui no ${paisOrigem} no pais!`)
        console.log(`Você ja pode dirigir senhor(a) ${nomeUsuario}!!!`)
    }
}