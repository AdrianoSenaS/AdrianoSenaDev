

const btnLogin = document.getElementById("btnLogin")
const email = document.getElementById("email")
const senha = document.getElementById("senha")


btnLogin.addEventListener('click', ()=>{
    api(urlApi+'/user').then(user=>{
        login(user)
     })
     
})

function login(userID){
   
    userID.forEach(element => {
        if(element.name == email.value && element.password == senha.value){
            localStorage.setIten('login',element.email+element.password) 
            window.location.href = "dashboard.html"
           
        }
    });
    
}
