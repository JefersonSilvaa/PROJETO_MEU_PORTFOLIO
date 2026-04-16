function somar(){
    //ligação de dados
    var cs1 = document.querySelector('input#somarId01')
    var cs2 = document.querySelector('input#somarId02')
    var ls = document.querySelector('div#reS')
    //manipulação de dados
    var s1 = Number(cs1.value)
    var s2 = Number(cs2.value)
    //calculo
    var rs = s1 + s2
    //resposta do sistema
    ls.innerHTML = ` Resultado foi : ${rs} `
}

function subtracao(){
    //ligação de dados
    var csb1 = document.querySelector('input#subtracaoId01')
    var csb2 = document.querySelector('input#subtracaoId02')
    var crSt = document.querySelector('div#reST')
    //manipulação de dados
    var sb1 = Number(csb1.value)
    var sb2 = Number(csb2.value)
    //calculo
    var Rsb = sb1 - sb2 
    //resposta do sitema
    crSt.innerHTML = `respostar foi : ${Rsb}`
}

function divisao(){
    //ligação de dados
    var cd1 = document.querySelector('input#divisaoId01')
    var cd2 = document.querySelector('input#divisaoId02')
    var resD = document.querySelector('div#resD')
    //manipulação dedos
    var d1 = Number(cd1.value)
    var d2 = Number(cd2.value)
    //calculo
    var rd = d1 / d2
    //resposta do sitema
    resD.innerHTML = `Resposta foi : ${rd}`
}

function multiplicacao(){
    //ligação de dados
    var cm1 = document.querySelector('input#multiplicacaoId01')
    var cm2 = document.querySelector('input#multiplicacaoId02')
    var resM = document.querySelector('div#resM')
    //manipulaçãod de dados
    var m1 = Number(cm1.value)
    var m2 = Number(cm2.value)
    //calculo
    var rm = m1 * m2 
    //resposta do sistema
    resM.innerHTML = `Resposta foi : ${rm}`
}

function resto(){
    //ligação de dados
    var cr1 = document.querySelector('input#restoId01')
    var cr2 = document.querySelector('input#restoId02')
    var resR = document.querySelector('div#resR')
    //manipulação de dados
    var r1 = Number(cr1.value)
    var r2 = Number(cr2.value)
    //calculo
    var rr = r1 % r2 
    //resposta do sistema
    resR.innerHTML = `Respostar foi : ${rr}`
}

function aoquadrado(){
    //ligação de dados
    var caq01 = document.querySelector('input#quadradoId01')
    var caq02 = document.querySelector('input#quadradoId02')
    var resAQ = document.querySelector('div#resAQ')
    //manipulação de dados
    var aq01 = Number(caq01.value)
    var aq02 = Number(caq02.value)
    //calculo
    var raq = aq01 ** aq02
    //resposta do sistema
    resAQ.innerHTML = `Respostar foi : ${raq}`
}

  //pergunta do nome 
  var nomeUsuario = window.prompt('Olá seja bem-vindo, qual o seu >nome<')
  var localnome = document.querySelector('h2#usuarioNome')
  //resposta do sistema 
  localnome.innerHTML = `seja bem-vindo , <strong> ${nomeUsuario.toLocaleUpperCase()} </strong> !!!`