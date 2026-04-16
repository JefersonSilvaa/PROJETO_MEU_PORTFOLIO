// var,let e const
/*
O 'var' funcionar como varivel global.
1- funcionar todos os blocos como : funtion,if,else e for etc...
exemplos:
*/
var nome1 = 'jefinho'
function mostrarNome(){
    var nome = 'caio'
    console.log(`${nome} e ${nome1}`)
    for(n = 1;n <= 5;n++){
        console.log(`${n}`)
    }
}
mostrarNome()
