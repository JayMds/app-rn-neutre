import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';





const ForgotPassword = async(email) =>{
    
    try {
       
const resp = await fetch('',{
    method : 'POST',
    headers : {
        
        'Content-Type': 'application/json',
    },
    body : JSON.stringify({
Email :   email
    }
        )
})

const data = await resp.json()
if(data.payload != null){
    ToastAndroid.show('mot de passe envoyé par mail', ToastAndroid.SHORT)
    await AsyncStorage.setItem('changePassword','true')
    return true
   
}
else
{
    ToastAndroid.show('Email invalide', ToastAndroid.SHORT)
    return false
}
}

catch(error ) {
    console.log(error)
}
}




export default  ForgotPassword;