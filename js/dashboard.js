const contact = document.getElementById("contact")
const login =  localStorage.get('login')

if(login == null){
    window.location.href= "./login"
}
    
api(urlApi+"/contact").then(contacts=>{
    contacts.map(contacts1=>{
      contact.innerHTML +=innerText(contacts1)
    })
})

function innerText(contacts1){
    return `
        <div class="d-flex align-items-center border-bottom py-3">
         <div class="w-100 ms-3">
          <div class="d-flex w-100 justify-content-between">
           <h6 class="mb-0">${contacts1.name}</h6>
            <small>${contacts1.email}</small>
           </div>
           <span>${contacts1.message}</span>
         </div>
        </div>
    `
}


