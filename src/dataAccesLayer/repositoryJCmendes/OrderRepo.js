import React from 'react';
import { ToastAndroid } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getSessionId} from "../../utils/tools/saveSessionId";

{/*todo rendre les url parametrables*/}

export async function loadOrderHystory(dispatch) {
    dispatch({
        type:'orderList/loadOrderHistoryList',
        payload : await getOrderHistory()
    })
}

export const getOrderHistory= async() =>{
    const resp = await fetch(''+ await AsyncStorage.getItem('ShopID')+'/true',{
        method : 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + await getSessionId('Session')},
    })
        //.catch(response => console.log(response))
    const data = await resp.json()
    if(data.payload != null){

        return data.payload;
       // ToastAndroid.show("Données Récupérés",ToastAndroid.LONG)
    }else{

        ToastAndroid.show("Erreur Survenue",ToastAndroid.LONG)
    }
}

export async function loadOrderList(dispatch){
    dispatch({
        type:'orderList/loadOrderList',
        payload : await getCurrentOrders()
    })
}

export const getCurrentOrders = async(setState) =>{

    const resp = await fetch(''+ await AsyncStorage.getItem('ShopID') +'/false',{
        method : 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + await getSessionId('Session')},
    })

    const data = await resp.json()

    //console.log(data)
    if(data.payload != null){
       // ToastAndroid.show("Données Commandes en cours Récupérés",ToastAndroid.LONG)

        return data.payload;
    }else{

        ToastAndroid.show("Erreur Survenue",ToastAndroid.LONG)
    }
}

export const getOrderItemsByOrderId = async(setData, setItems,setUrl ,id) =>{

    const resp = await fetch('' + id,{
        method : 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getSessionId('Session')
        },
    })
    const data = await resp.json()
    if(data.payload != null){
        ToastAndroid.show("Données Récupérés",ToastAndroid.LONG)
        console.log('paload',data.payload)
        setData(data.payload.orderDetails)
        setItems(data.payload.orderItems)
        setUrl(data.payload.invoiceLink)

    }else{

        ToastAndroid.show("Erreur Survenue",ToastAndroid.LONG)
    }

}
/**
 * @param order
 * @param progressStatus
 * public enum OrderProgressStatus
 *         PENDING = 0,
 *         PLACED = 1,
 *         INPROGRESS = 2,
 *         READYFORDELIVERY = 3,
 *         READYFORPICKUP = 4,
 *         COMPLETED = 5, //DELIVERED
 *         CANCELORDER = 6,
 *         REFUNDED = 7, //REFUSED
 *         ACCEPTED = 8,
 *         OUTFORDELIVERY = 9
 */
export const changeOrderStatus = async(order, progressStatus) =>{
    try {
        const resp = await fetch('',{
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + await getSessionId('Session')
            },
            body: JSON.stringify({
                UserId: order.customerId,
                OrderId: order.orderID,
                ProgressStatus: progressStatus
            })
        })

        const data = await resp.json()
        ToastAndroid.show(data.message,ToastAndroid.LONG)
        console.log(data.payload)
    }
    catch(error) {
        console.log(error)
    }
}