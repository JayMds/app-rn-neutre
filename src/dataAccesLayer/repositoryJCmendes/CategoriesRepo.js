import {ToastAndroid} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getSessionId} from "../../utils/tools/saveSessionId";


export const getActiveCategories = async() => {
    const resp = await fetch(''
        + await AsyncStorage.getItem('ShopID') +'/0/1',{
        method : 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' +  await getSessionId('Session') }, // from SecureStorage
    })

    const data = await resp.json()
    if(data.payload != null){
        //ToastAndroid.show("Données Récupérés",ToastAndroid.LONG)
        return data.payload;
    }else{
        ToastAndroid.show("Erreur Survenue",ToastAndroid.LONG)
    }
}
export async function loadActiveCategories(dispatch){
    dispatch({
        type:'productCategoryList/loadActiveProductCategoryList',
        payload: await getActiveCategories()
    })
}

export const getAllProductCategories = async() => {
    const resp = await fetch(''+ await AsyncStorage.getItem('ShopID') +'/0/0',{
        method : 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + await getSessionId('Session')},
    })
    //.catch(response => console.log(response))
    const data = await resp.json()
    if(data.payload != null){
        //ToastAndroid.show("Données Récupérés",ToastAndroid.LONG)
        return data.payload;
    }else{
        ToastAndroid.show("Erreur Survenue",ToastAndroid.LONG)
    }
}
export async function loadAllCategories(dispatch){
    dispatch({
        type:'productCategoryList/loadProductCategoryList',
        payload: await getAllProductCategories()
    })
}


export const addCategory = async(data) =>{
    const resp = await fetch('',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + await getSessionId('Session') },
        body : JSON.stringify({
            IsActive: data.isActive,
            ProductCategoryName : data.productCategoryName,
            ShopId : data.shopId,
            OrderSequence : data.orderSequence
        })
    })
    const fetchedResponse = await resp.json()
    if(fetchedResponse.statusCode == 200){
        ToastAndroid.show("Catégorie ajoutée avec succes",ToastAndroid.LONG)
        console.log(fetchedResponse)

    } else {
        ToastAndroid.show("Une erreur est survenue",ToastAndroid.LONG)
    }
}

export const editCategory = async(data) =>{
    const resp = await fetch('',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + await getSessionId('Session') },
        body : JSON.stringify({
            ProductCategoryId: data.productCategoryId,
            IsActive: data.isActive,
            ProductCategoryName : data.productCategoryName,
            ShopId : data.shopId,
            OrderSequence : data.orderSequence
        })
    })
    const fetchedResponse = await resp.json()
    if(fetchedResponse.statusCode == 200){
        ToastAndroid.show("Catégorie modifiée avec succes",ToastAndroid.LONG)
    } else {
        ToastAndroid.show("Une erreur est survenue",ToastAndroid.LONG)
    }
}


