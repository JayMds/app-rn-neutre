import AsyncStorage from "@react-native-async-storage/async-storage";
import {getSessionId} from "../../utils/tools/saveSessionId";

const EditOpenHours = async(tabToSubmit) =>{
    try {
        const resp = await fetch('',{
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
'Authorization' : 'Bearer ' + await getSessionId('Session')
            },
            
            body :JSON.stringify( {
                ShopID : await AsyncStorage.getItem('ShopID'),
                DeliveryMethod : tabToSubmit[0].deliveryMethod,
                OpeningHours : tabToSubmit
            })
        })
        const fetchedResponse  = await resp.json()
        if(fetchedResponse.statusCode == 200){
            return true
        }else{
            return false
        }
    }
    catch(error){
        console.log(error)
    }
}

export default EditOpenHours