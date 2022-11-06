import {getSessionId} from "../../utils/tools/saveSessionId";

const CategoriesDB = async() =>{
    try{
        const resp = await fetch('' ,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + await getSessionId('Session')
            }
        })
        const data = await resp.json()
        return data.payload
    }
    catch (error){
        console.log(error)
    }
}

export default  CategoriesDB;