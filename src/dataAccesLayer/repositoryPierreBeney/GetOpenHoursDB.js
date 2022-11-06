import AsyncStorage from '@react-native-async-storage/async-storage';


const GetOpenHoursDB = async(livraison) =>{
    let deliveryType
    if(await livraison === true ){
        deliveryType = '/2'
    }else{
        deliveryType = '/1'
    }
    
    try{
        const resp = await fetch('' + await AsyncStorage.getItem('ShopID')+ deliveryType ,{
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        const data = await resp.json()
       return data.payload
       
    }
    catch (error){
        console.log(error)
    }
}

export default  GetOpenHoursDB;