var horaAtual = new Date()

var hora = horaAtual.getHours()
var minutos = horaAtual.getMinutes()

console.log(`Agora são exatamente ${hora} horas ${minutos} Minutos`)
if(hora < 12 && hora >= 7 ){
    console.log(`bom diaaaa , Como você estar?`)
} else if(hora <= 18 && hora >= 12){
    console.log(`boa tardeee , como está sendo sua tarde?`)
} else if(hora < 24 && hora >= 19){
    console.log(`boa noiteeee , como está sendo sua noite?`)
} else if(hora >= 1 && hora <= 6){
    console.log(`Como está sendo sua madrugada??`)
}
