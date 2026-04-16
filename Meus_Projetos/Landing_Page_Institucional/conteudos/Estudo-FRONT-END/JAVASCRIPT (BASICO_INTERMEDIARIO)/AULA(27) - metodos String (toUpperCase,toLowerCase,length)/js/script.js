  // length

  var nome = 'matheus';

  console.log(nome.length); // quantidade das letras da palavra.

  var obj = 'bola';

  console.log(' objeto com ' + obj.length + ' letras '); // Exemplo.

 // indexOf pucha posição para do obj!!!

 console.log(nome[2]); // puxando nome matheus do var 'name'.

 var frase = 'O rato roeu a roupa do rei de Roma';

 console.log(frase.indexOf('roeu')); // atenção os espasos entre as letras são levados em conta(atenção).

 // slice ( server para remove[algo] OU estrair[algo])

 var roeu = frase.slice(7,11); // 11 um espeço depois da letra ksks 

 console.log(roeu);

 // replace (faz troca de uma palavra)

 var novafrase = frase.replace('roeu','testou'); // mostra qual será tirado de depois ad no local.

 console.log(novafrase)