import AsyncStorage from '@react-native-async-storage/async-storage';
import {getSessionId} from "../../utils/tools/saveSessionId";


const UserProfileDB = async() =>{
    try {
const resp = await fetch(''+ await AsyncStorage.getItem('ShopID'),{
    headers : {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + await getSessionId('Session')
    }
})

const data = await resp.json()

return data.payload
}

catch(error ) {
    console.log(error)
}
}




export default  UserProfileDB;
