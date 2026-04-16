
function contador(){
    var InicioId = Number(document.querySelector('input#inicioId').value);
    var FimId = Number(document.querySelector('input#FimId').value);
    var PassoId = Number(document.querySelector('input#PassoId').value);
    var res_contador = document.querySelector('div#res-contado');
    var res_contador2 = document.querySelector('div#res-contador2');

   if(InicioId == 0 || FimId == 0 || PassoId == 0){
        window.alert('[ERRO] verifique se informou as informações abaixo!!!')
   } else if (InicioId < FimId) {
            res_contador2.innerHTML = ''
        for(var c = InicioId; c < FimId; c += PassoId){
            res_contador2.innerHTML += `<p>${c}</p> `
        }
            res_contador2.innerHTML += `<p>${FimId}</p>`
   } else {
            res_contador2.innerHTML = ''
        for(var c = InicioId; c >= FimId; c -= PassoId){
            res_contador2.innerHTML += `<p>${c}</p> `
        }
   }
};