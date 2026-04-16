function verificadorIdade(){ 
   var dataAtual = new Date()
   var anoAtual = dataAtual.getFullYear()
   //LIGAÇÃO DE DADOS
   var anoNascimento = document.querySelector('input#anoN')
   var LocalRes = document.querySelector('p#res')

   if(anoNascimento.value.length == 0 || Number(anoNascimento.value) > anoAtual || anoNascimento.value < 0 || anoNascimento.value <= 1809 ){
      window.alert('Por favor preenchar os dados abaixo corretamente!!!')
   } else {

       var Fsex = document.getElementsByName('radSex') // utilizando 'name' do input.
       var idadeUsuario = anoAtual - Number(anoNascimento.value)
       var genero = ''

       //criando elemento em js
       var img = document.createElement('img')
       img.setAttribute('id','foto')


       if(Fsex[0].checked){
            genero = 'Homen'
            if(idadeUsuario >= 0 && idadeUsuario <= 4){ //bebe
                img.setAttribute('src', 'img/bebe-M.png')
                LocalRes.innerHTML = `Detectamos um Bebe com ${idadeUsuario} anos.`
                LocalRes.appendChild(img);
            } else if(idadeUsuario <= 17 ){ // criança 
                img.setAttribute('src', 'img/criança-M.png')
                LocalRes.innerHTML = `Detectamos um Criança com ${idadeUsuario} anos.`
                LocalRes.appendChild(img);
            } else if(idadeUsuario <= 29){ // jovem
                img.setAttribute('src', 'img/jovem-M.png')
                LocalRes.innerHTML = `Detectamos um Jovem com ${idadeUsuario} anos.`
                LocalRes.appendChild(img);
            } else if(idadeUsuario <= 50) { // adulto
                img.setAttribute('src', 'img/adulto-M.png')
                LocalRes.innerHTML = `Detectamos um Adulto com ${idadeUsuario} anos.`
                LocalRes.appendChild(img);
            } else { // idoso
                img.setAttribute('src', 'img/idoso-M.png')
                LocalRes.innerHTML = `Detectamos um Idoso com ${idadeUsuario} anos.`
                LocalRes.appendChild(img);
            }          
        } else if(Fsex[1].checked){
            genero = 'mulher'
            if(idadeUsuario >= 0 && idadeUsuario <= 4){ //bebe
                img.setAttribute('src', 'img/bebe-F.png')
                LocalRes.innerHTML = `Detectamos um Bebe com ${idadeUsuario} anos.`
                LocalRes.appendChild(img);
            } else if(idadeUsuario <= 17 ){ // criança
                img.setAttribute('src', 'img/criança-F.png')
                LocalRes.innerHTML = `Detectamos um Criança com ${idadeUsuario} anos.`
                LocalRes.appendChild(img);
            } else if(idadeUsuario <= 29){ // jovem
                img.setAttribute('src', 'img/jovem-F.png')
                LocalRes.innerHTML = `Detectamos um Jovem com ${idadeUsuario} anos.`
                LocalRes.appendChild(img);
            } else if(idadeUsuario <= 50) { // adulto
                img.setAttribute('src', 'img/adulto-F.png')
                LocalRes.innerHTML = `Detectamos um Adulto com ${idadeUsuario} anos.`
                LocalRes.appendChild(img);
            } else { // idoso
                img.setAttribute('src', 'img/idoso-F.png')
                LocalRes.innerHTML = `Detectamos um Idoso com ${idadeUsuario} anos.`
                LocalRes.appendChild(img);
            }     
       }
   }
}