for(var i = 10; i > 0;i--){
   console.log(i)

   if( i === 5){
       break; // Quebra aqui no codigo
   }
};

for(var j = 0 ; j <= 100;j += 10){

    if(j == 20){
        console.log('CONTINUE') // Quebra aqui ,porem, continuar codigo:(Quando atingir a condiçao do 'if' )
        continue;
    }
    if(j == 70){
        console.log('CONTINUE') // Quebra aqui ,porem, continuar codigo:(Quando atingir a condiçao do 'if' )
        continue;
    }
    console.log('Testando continue ' + j)
};