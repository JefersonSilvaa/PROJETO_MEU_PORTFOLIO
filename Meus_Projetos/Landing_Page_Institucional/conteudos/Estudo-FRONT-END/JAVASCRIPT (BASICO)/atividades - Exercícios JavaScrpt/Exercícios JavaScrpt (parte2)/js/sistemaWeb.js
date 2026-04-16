function carregar(){
    //ligação de dados
    var msg = document.querySelector('div#msg') //local da mensagem
    var img = document.querySelector('img#imagem') // local da imagem

    //camados horas
    var dataAtual = new Date() // comando sistema Usuario
    var horaATual = dataAtual.getHours()
    var minutosAtual = dataAtual.getMinutes()

    //local da mensagem
    msg.innerHTML = ` <h1> Agora são ${horaATual} Horas ${minutosAtual} Minutos </h1> `

    //local da foto 
    if(horaATual >= 0 && horaATual < 12){
        //bom dia
        img.src = 'img/Manha-1.png'
        document.body.style.backgroundColor = '#F4CB96'
    } else if (horaATual >= 12 && horaATual < 18){
        //boa tarde
        img.src = 'img/Tarde-3.png'
        document.body.style.backgroundColor = '#EEA983'
    } else {
        //boa noite
        img.src = 'img/Noite-2.png'
        document.body.style.backgroundColor = '#142644'
    }
}
