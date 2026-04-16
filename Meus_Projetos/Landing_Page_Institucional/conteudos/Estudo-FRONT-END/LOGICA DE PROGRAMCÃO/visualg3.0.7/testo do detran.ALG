algoritmo "semnome"
var
   ano_atual , ano_nasc , minimo : inteiro

inicio
      escreval (" ano atual (yyyy)")
      leia (ano_atual)
       escreval (" ano de nascimento")
       leia (ano_nasc)
       minimo <- ano_atual - ano_nasc
      se ( minimo >= 18) entao
         escreva (" parabens ! voce estar abtor para tira sua abilitaçao ")
         escreva (" leve as documentação minimas como :cpf e  RG , etc... ")
      senao
        escreva (" voce ainda nao possuir a idade minima de tira , sua documentaçao ")
      fimse

fimalgoritmo