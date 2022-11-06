import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastAndroid} from "react-native";
import {getSessionId} from "../../utils/tools/saveSessionId";

export const getUserShop = async(setUserProfile) =>{
    try {
        const resp = await fetch(''+ await AsyncStorage.getItem('ShopID'),{
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + await getSessionId('Session')
            }
        })

        const data = await resp.json()
        console.log(data.payload)
        setUserProfile(data.payload)
        return data.payload;
    }

    catch(error ) {
        console.log(error)
    }
}

export const postShopConfig = async(dataConfig) => {
    try {
        const resp = await fetch('',{
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + await getSessionId('Session')
            },
            body: JSON.stringify({
                ShopId: dataConfig.shopId,
                PreparationTime: dataConfig.preparationTime,
                PreparationTimeForDelivery: dataConfig.preparationTimeForDelivery,
                DeliveryMethod: dataConfig.deliveryMethod
            })
        })

        const data = await resp.json()
        ToastAndroid.show(data.message,ToastAndroid.LONG)
        console.log(data.payload)
    }
    catch(error ) {
        console.log(error)
    }
}