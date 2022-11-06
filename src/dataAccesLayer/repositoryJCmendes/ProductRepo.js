import React from 'react';
import { ToastAndroid } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getSessionId, saveSessionId} from "../../utils/tools/saveSessionId";


/**
 * Load all products
 */

export async function loadProductList(dispatch){
    dispatch({
        type: 'productList/loadProductList',
        payload: await getProducts()
    })
}

export const getProducts = async() =>{
    const sessionToken = await getSessionId('Session')
    const shopID = await  AsyncStorage.getItem('ShopID')
    const resp = await fetch('' + shopID + '/0',{
        method : 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + sessionToken},
    })
    const data = await resp.json()
    if(data.payload != null){
        ToastAndroid.show("Produits Récupérés",ToastAndroid.LONG)
        console.log(data.payload)
        return data.payload;
    }else{
        ToastAndroid.show("Erreur Survenue",ToastAndroid.LONG)
    }
}

/**
 * Load product details
 */
export async function loadProductDetails(dispatch, id){
    dispatch({
        type: 'productList/loadActualProduct',
        payload: await getProductById(id)
    })
}

export const getProductById = async(id) =>{

        const resp = await fetch(''+ id,{
            method : 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + await getSessionId('Session')},
        })
            //.catch(response => console.log(response))
        const data = await resp.json()
        if(data.payload != null){
            console.log(data.payload)
            return data.payload;
            //ToastAndroid.show("Données Récupérés",ToastAndroid.LONG)
        }else{

            ToastAndroid.show("Erreur Survenue",ToastAndroid.LONG)
        }
}
/**
 * retourne l'url de l'image uploadée
 */
export const uploadProductIcon = async(image) => {
    let adminID;
    let lastToken;
    // prendre le dernier token de connexion avant de post l'image(d'abord adminId puis dernier token)
    try{
        const resp = await fetch('' + await AsyncStorage.getItem('ShopID') + '/0',{
            method : 'GET',
            headers: { 'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + await getSessionId('Session') }

        })
        const fetchedResponse = await resp.json()
        if(fetchedResponse != null){
            adminID =  await fetchedResponse.payload[0].adminId

        }
    }
    catch(error) {
        console.log(error)
    }
    try{
        const resp = await fetch('',{
            method : 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + await getSessionId('Session') },
            body : JSON.stringify({
                UserId : await adminID
            })

        })
        const fetchedResponse = await resp.json()
        if(fetchedResponse != null){
            lastToken = await fetchedResponse.payload.tokens.token
            await saveSessionId('Session', lastToken)
        }

    }
    catch(error) {
        console.log(error)
    }
//upload la photo et récupérer l'uri générée pour l'associer à l'utilisateur
    try{
        console.log(image)
        const tab = image.split(".")
        const authorization = 'Bearer ' + await lastToken
        const formData = new FormData()
        formData.append('file',{uri : image, type : 'image/jpg',name : 'image.' +tab[tab.length-1] })
        const resp = await fetch('',{
            method : 'POST',
            headers: { 'Authorization' : authorization,

            },
            body : formData

        })
        const fetchedResponse = await resp.json()
        //console.log(fetchedResponse)
        if(await fetchedResponse.payload!= null){
            return await fetchedResponse.payload.attachmentExternalUrl
        }
    }
    catch(error) {
        console.log(error)
    }
}
/**
 * Ajout de produit
 * @param data
 */
export const addProduct = async(data) =>{
    try {
    const resp = await fetch('',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + await getSessionId('Session') },
        body : JSON.stringify({
            ShopId: data.shopId,
            ProductCategoryId: data.productCategoryId,
            ProductName: data.productName,
            ProductDesc: data.productDesc,
            ProductIcon: data.productIcon ,
            ProductPrice: data.productPrice,
            ProductUnit: data.productUnit,
            ProductPricePerKG: data.productPricePerKG,
            ProductTaxValue: data.productTaxValue,
            PreviousPrice: data.productPrice,
            IsSale: data.isSale,
            IsUnsold: data.isUnsold,
            IsFragile: data.isFragile,
            IsBigBasket: data.isBigBasket,
            IsPanier: data.isPanier,
            ProductSKUCode: null,
            ProductSAPCode: null,
            ProductStatus: 1,
        })
    })
    const fetchedResponse = await resp.json()
        console.log(fetchedResponse)
    if(fetchedResponse.statusCode == 200){
        ToastAndroid.show("Produit ajouté avec succes",ToastAndroid.LONG)

    } else {
        ToastAndroid.show("Une erreur est survenue",ToastAndroid.LONG)
    }
    console.log(fetchedResponse)
    }
    catch (error) {
        console.log(error)

    }
}

export const editProduct = async(data) =>{
    try {
        const resp = await fetch('',{
            method : 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + await getSessionId('Session') },
            body : JSON.stringify({
                ProductRecordId: data.productRecordId,
                ProductId: data.productId,
                ShopId: data.shopId,
                ProductCategoryId: data.productCategoryId,
                ProductName: data.productName,
                ProductDesc: data.productDesc,
                ProductIcon: data.productIcon,
                ProductPrice: data.productPrice,
                ProductUnit: data.productUnit,
                ProductPricePerKG: data.productPricePerKG,
                ProductTaxValue: data.productTaxValue,
                PreviousPrice: data.previousPrice,
                IsSale: data.isSale,
                IsUnsold: data.isUnsold,
                IsFragile: data.isFragile,
                IsBigBasket: data.isBigBasket,
                IsPanier: data.isPanier,
                ProductSKUCode: null,
                ProductSAPCode: null,
                ProductStatus: data.productStatus,
            })
        })
        const fetchedResponse = await resp.json()
        //console.log(fetchedResponse)
        if(fetchedResponse.statusCode == 200){
            ToastAndroid.show("Produit modifé avec succes",ToastAndroid.LONG)
        } else {
            ToastAndroid.show("Une erreur est survenue",ToastAndroid.LONG)
        }

    }
    catch (error) {
        console.log(error)

    }
}

