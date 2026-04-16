var idade = 16;
var nome = 'matheus'

if(nome == 'matheus' && idade >= 16){
    console.log(`aluno (${nome}) pode faze aula de musica com (${idade} anos)`)
} else {
    console.log(`ìnfelizmente vc não esta matriculado no curso de musica`)
}

var nome = 'jeferson'
var idade = 18

if(nome != 'matheus' && idade >= 16){
    console.log(`aluno (${nome}) não pode faze aula de musica com (${idade} anos)`)
    if(idade > 16){
        console.log(`infelizmente não tem idade minima para fazer inscrição do curso`)
    }
}