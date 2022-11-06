
import {getSessionId, saveSessionId} from "../../utils/tools/saveSessionId";


const UploadShopIconDB = async(image,userProfileShopID) =>{
    let adminID;
    let lastToken;
 // prendre le dernier token de connexion avant de post l'image(d'abord adminId puis dernier token)
    try{
    const resp = await fetch('' + userProfileShopID + '/0',{
    method : 'GET',
    headers: { 'Content-Type': 'application/json',
'Authorization' : 'Bearer ' + await getSessionId('Session') }
    
})
const fetchedResponse = await resp.json()
if(fetchedResponse != null){
    adminID =  await fetchedResponse.payload[0].adminId
    
}
    }
catch(error) {
    console.log(error)
}
try{
    const resp = await fetch('',{
    method : 'POST',
    headers: { 'Content-Type': 'application/json',
'Authorization' : 'Bearer ' + await getSessionId('Session') },
body : JSON.stringify({
    UserId : await adminID
})
    
})
const fetchedResponse = await resp.json()
if(fetchedResponse != null){
    lastToken = await fetchedResponse.payload.tokens.token
    await saveSessionId('Session', lastToken)
    
}

    }
catch(error) {
    console.log(error)
}
//upload la photo et récupérer l'uri générée pour l'associer à l'utilisateur 
try{
    console.log(image)
    const tab = image.split(".")
    const authorization = 'Bearer ' + await lastToken
    const formData = new FormData()
    formData.append('file',{uri : image, type : 'image/jpg',name : 'image.' +tab[tab.length-1] })
    const resp = await fetch('',{
    method : 'POST',
    headers: { 'Authorization' : authorization,
   
 },
body : formData
    
})
const fetchedResponse = await resp.json()
console.log(fetchedResponse)
if(await fetchedResponse.payload!= null){
    return await fetchedResponse.payload.attachmentExternalUrl
}
    }
catch(error) {
    console.log(error)
}


}

export default UploadShopIconDB;