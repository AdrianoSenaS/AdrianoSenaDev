const urlApi = "https://api.adrianosena.dev.br/" 

async function api(req, res){
   const response = (await fetch(req))
   if(response.status === 200){
    res = response.json()
    return res
   }else{
   
    return  Error(response.status)
   }
}