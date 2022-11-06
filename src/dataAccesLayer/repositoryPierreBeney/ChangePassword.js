import AsyncStorage from "@react-native-async-storage/async-storage"
import { ToastAndroid } from 'react-native';
import {getSessionId} from "../../utils/tools/saveSessionId";


const ChangePassword = async(currentPassword,newPassword,confirmPassword) =>{
    let userId
    
    try {
       
        const resp = await fetch(''+ await AsyncStorage.getItem('ShopID') + '/0',{
            headers : {
                
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + await getSessionId('Session')
            }

        })

        const data = await resp.json()
        console.log(data)
        userId = data.payload[0].adminId
    }
    catch(error){
        console.log(error)
    }
    try {
       console.log(userId)
        const resp = await fetch('',{
            method : 'POST',
            headers : {
                
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + await getSessionId('Session')
            },
            body : JSON.stringify({
                CurrentPassword : currentPassword ,
                ConfirmPassword : confirmPassword,
                NewPassword : newPassword,
                UserId : userId,
                AccountType : 1
            })

        })

        const data = await resp.json()
        if(data.statusCode == 200){
            ToastAndroid.show('Mot de passe mis à jour!',ToastAndroid.SHORT)
            return true
        }else{
            ToastAndroid.show('Mauvais mot de passe actuel ou les nouveaus mots de passes ne correspondent pas!',ToastAndroid.SHORT)
        return false
        }
    }
    catch(error){
        console.log(error)
    }

}

export default ChangePassword;