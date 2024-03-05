const nome = document.getElementById("nome")
const email = document.getElementById("email")
const menssagem = document.getElementById("menssagem")
const send = document.getElementById("send")


send.addEventListener('click', ()=>{

    const form = {
        "name": nome.value,
        "email": email.value,
        "message": menssagem.value,
    }

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
    };

    fetch(urlApi+'/contact', options)
    .then(data=>{
        if(!data.ok){
            throw Error(data.status)
        }
        return data.json();
    })
    .then(update => {
        console.log(update);
    })
    .catch(e => {
        console.log(e);
    });
})