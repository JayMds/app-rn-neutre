import AsyncStorage from '@react-native-async-storage/async-storage';
import {getSessionId} from "../../utils/tools/saveSessionId";

const GetReviews = async() =>{
    try{
        const resp = await fetch('' + await AsyncStorage.getItem('ShopID') + '/0/0/1000' ,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + await getSessionId('Session')
            }
        })
        const data = await resp.json()
        data.payload.shopReviews.map((element,index)=>{
            element['sort'] = index + 1
        })
        return data.payload
    }
    catch (error){
        console.log(error)
    }
}

export default  GetReviews;