var lista = ['jeff', 'lucas', 'bruno', 'luiza','vini','lucas'];

var listaUl = document.createElement('ul'); // criando um elemento em html pelo javaScript.

var body = document.getElementsByTagName('body'); // fazendo uma ligação.

//console.log(body[0]); // insersão de elementos (escolhendo um elemento com mesma tegName do html).

body[0].appendChild(listaUl) // como adcionar um elemento filho dentro do (body[0] selection no html).

var listaNoBody = document.getElementsByTagName('ul') //fazendo uma ligação com elemento criando.

for(var i = 0; i < lista.length; i++){

    var lifor = document.createElement('li'); // criando Elemento 'li'.

    var textoLi = document.createTextNode(lista[i]); // adcionando texto da lista pela quantidade do contador.

    lifor.appendChild(textoLi); //adcionando texto na li da reptição.

    listaNoBody[0].appendChild(lifor); // adcionando a li dentro da ul.
}