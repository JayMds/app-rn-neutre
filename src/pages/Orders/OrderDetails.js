import React, {useEffect, useState} from 'react';
import {Button, Linking, SafeAreaView, ScrollView, View} from 'react-native';
import OrderDetailsRecap from '../../components/OrderDetails/OrderDetailsRecap';
import OrderDetailsList from '../../components/OrderDetails/OrderDetailsList';
import {useFocusEffect} from "@react-navigation/native";
import {changeOrderStatus, getOrderItemsByOrderId} from "../../dataAccesLayer/repositoryJCmendes/OrderRepo";
import strings from "../../utils/res/strings";

const OrderDetails = ({route, navigation}) =>{

    const cancelButton =  <Button title='Refuser' onPress={dicardOrder}/>

    function getInvoiceBill() {
       Linking.openURL(billUrl)
    }
    function orderCompleted() {
        changeOrderStatus(orderData, 5)
    }
    function readyForDelivery() {
        changeOrderStatus(orderData, 3)
        navigation.navigate(strings.tabs.orders)
    }
    function readyForPickUp() {
        changeOrderStatus(orderData, 4)
        navigation.navigate(strings.tabs.orders)
    }
    function startOrder() {
        changeOrderStatus(orderData, 2)
        navigation.navigate(strings.tabs.orders)
    }
    function acceptOrder() {
        changeOrderStatus(orderData, 8)
        navigation.navigate(strings.tabs.orders)
    }
    function dicardOrder() {
        changeOrderStatus(orderData, 7)
        navigation.navigate(strings.tabs.orders)
    }

    //orderID
    const clickedId = route.params.orderID;
    //donnée order
    const [orderData, setOrderData] = useState([]);
    const [items, setItems] = useState([]);
    const [billUrl, setBillUrl] = useState('');

    useEffect(() => {


    }, [route.params]);


    useFocusEffect(
        React.useCallback(()=>{

            getOrderItemsByOrderId(setOrderData, setItems, setBillUrl ,clickedId)
            console.log(billUrl)
            console.log(orderData)
        }, [route.params])
    )
    return(
        <SafeAreaView className="flex-1 bg-white">
            <Button title={'Retour'} onPress={()=>orderData.orderProgressStatus >= 5 ? navigation.navigate(strings.tabs.orderHistory): navigation.navigate(strings.tabs.orders)}/>

            <ScrollView className="flex flex-col">
            <OrderDetailsRecap orderDetails={orderData}/>

                <ScrollView>
                    <OrderDetailsList orderItems={items}/>
                </ScrollView>

            </ScrollView>
            {orderData.orderProgressStatus === 1 && orderData.orderProgressStatusForBO === 1 &&
                <View className="flex-row justify-center m-2 ">
                    <Button title='Accepter' onPress={acceptOrder}/>
                    {cancelButton}
                </View>}
            {orderData.orderProgressStatus === 1 && orderData.orderProgressStatusForBO ===  8 &&
                <View className="flex-row justify-center m-2 ">
                    <Button title='Commencer la préparation' onPress={startOrder}/>
                    {cancelButton}
                </View>}
            {orderData.orderProgressStatus === 2 && orderData.orderProgressStatusForBO ===  2 && orderData.deliveryMethod === 1 &&
                <View className="flex-row justify-center m-2 ">
                    <Button title='Prête pour Click&Collect' onPress={readyForPickUp}/>
                </View>}
            {orderData.orderProgressStatus === 2 && orderData.orderProgressStatusForBO ===  2 && orderData.deliveryMethod === 2 &&
                <View className="flex-row justify-center m-2 ">
                    <Button title='Prête pour la livraison' onPress={readyForPickUp}/>
                </View>}
            {orderData.orderProgressStatus === 4 && orderData.orderProgressStatusForBO ===  4 &&
                <View className="flex-row justify-center m-2 ">
                    <Button title='Commande récupérée' onPress={orderCompleted}/>
                </View>}
            {orderData.orderProgressStatus >= 5 && orderData.orderProgressStatusForBO >=  5 &&
                <Button title={'Facture'} onPress={getInvoiceBill}/>}

        </SafeAreaView>
    )
}

export default OrderDetails;