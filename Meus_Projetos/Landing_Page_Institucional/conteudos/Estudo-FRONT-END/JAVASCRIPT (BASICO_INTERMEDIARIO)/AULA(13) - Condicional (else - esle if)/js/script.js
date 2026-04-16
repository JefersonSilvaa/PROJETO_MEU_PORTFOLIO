var IdadeUsuario = 18
var andarCarro = 'abilitação'
var nomeUsuario = 'jeff'
var paisOrigem = 'Brasil'

if( nomeUsuario == 'matheus'){
    console.log(`seja bem-vindo ${nomeUsuario} , informe sua idade !!!`);
    var IdadeUsuario;
    if(IdadeUsuario < 18){
        console.log(`Você infelizmente não possuir idade maior que (18 anos).`);
    } else {
        console.log(`Você ja é maior de idade com (${IdadeUsuario})`);
    }
} else if(nomeUsuario == 'lucas'){
    console.log(`seja bem-vindo ${nomeUsuario} , informe sua idade !!!`);
    var IdadeUsuario = 19;
    if(IdadeUsuario < 18){
         console.log(`Você infelizmente não possuir idade maior que (18 anos).`);
         console.log(`Você ja é maior de idade com (${IdadeUsuario})`);
    }
}  else {
    console.log(`infelizmente não temos seu nome no sistema ou resgistro senhor (${nomeUsuario})`);
}