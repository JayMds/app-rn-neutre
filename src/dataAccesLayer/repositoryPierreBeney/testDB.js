import { ToastAndroid } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadProductList} from "../repositoryJCmendes/ProductRepo";
import {loadOrderHystory, loadOrderList} from "../repositoryJCmendes/OrderRepo";
import {loadActiveCategories, loadAllCategories} from "../repositoryJCmendes/CategoriesRepo";
import {saveSessionId} from "../../utils/tools/saveSessionId";



const testDB = async(identifiant,motDePasse,isSwitchedRememberMe,isSwitchedPrivacy,isSwitchedCGU, dispatch) =>{
const resp = await fetch('',{
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body : JSON.stringify({
        Email : identifiant,
        Password : motDePasse,
        AccountType : 1
    })
    
})
const data = await resp.json()
let retour = false
console.log(isSwitchedCGU)
console.log(isSwitchedPrivacy)
if(data.payload != null){
console.log(data)
    if(isSwitchedCGU == 'unchecked'){
        ToastAndroid.show("Veuillez lire et accepter les conditions d'utilisation du site!",ToastAndroid.SHORT)
        return false
    }
    if(isSwitchedPrivacy == 'unchecked'){
        ToastAndroid.show("Veuillez lire et accepter la politique de confidentialité du site!",ToastAndroid.SHORT)
        return false
    }



    ToastAndroid.show("Félicitations! vous êtes connecté",ToastAndroid.SHORT)
    if(isSwitchedRememberMe == true){
       await saveSessionId('Session',data.payload.tokens.token)

    }
    
    retour =  true
}else{
    
    ToastAndroid.show("Erreur d'identifiant ou de mot de passe veuillez réessayer",ToastAndroid.SHORT)
    retour = false
}
if (retour == true){
    await AsyncStorage.setItem('ShopID',data.payload.adminInfo.shopId )
    await loadProductList(dispatch)
    await loadOrderHystory(dispatch)
    await loadOrderList(dispatch)
    await loadAllCategories(dispatch)
    await loadActiveCategories(dispatch)
}
return retour
}

export default testDB;