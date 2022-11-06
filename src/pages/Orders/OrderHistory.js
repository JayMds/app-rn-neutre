import React, { useState} from 'react';
import {SafeAreaView, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {useFocusEffect} from "@react-navigation/native";
import {loadOrderHystory} from "../../dataAccesLayer/repositoryJCmendes/OrderRepo";
import OrderCard from "../../components/Order/OrderCard";
import {exportedOrderHistoryStore} from "../../redux/slices/orderSlice";

const OrderHistory = () => {
    /**
     *Chargement Orders et Set Filtre depart (toute les commandes)
     */
    const dispatch = useDispatch();
    

    useFocusEffect(
        React.useCallback(()=>{
            loadOrderHystory(dispatch);
            setFilter(orders);
        }, [])
    )
    
    /**
     * Variables et states locaux 
     */
    const orders = useSelector(exportedOrderHistoryStore);

    const clickCollectOrders = orders.filter( c => c.deliveryTypeId === 1);
    const deliveryOrders = orders.filter( c => c.deliveryTypeId === 2);
    const completedOrders = orders.filter( c => c.orderProgressStatus === 5);
    const cancelledOrders = orders.filter( c => c.orderProgressStatus === 6);
    const refundedOrders = orders.filter( c => c.orderProgressStatus === 7);
    const [filter, setFilter] = useState(orders);

    /**
     *Fonctions
     */
    function setAllOrders() {
        setFilter(orders)
        console.log(filter)
    }
    function setDeliveryOrders() {
        setFilter(deliveryOrders)
        console.log(filter)
    }
    function setClickCollectOrders() {
        setFilter(clickCollectOrders)
        console.log(filter)
    }
    function setCompletedOrders() {
        setFilter(completedOrders)
        console.log(filter)
    }
    function setCancelledOrders() {
        setFilter(cancelledOrders)
        console.log(filter)
    }
    function setRefundedOrders() {
        setFilter(refundedOrders)
        console.log(filter)
    }

    return (
        <SafeAreaView className="flex-1 bg-white ">

            <View className = ' shadow-lg rounded-xl '>
                <View className='m-1 flex-wrap flex-row justify-evenly  rounded-xl '>
                    <TouchableOpacity  onPress={setAllOrders}>
                        <Text className='p-2 font-bold text-gray-700 shadow border border-gray-200 rounded-xl'>
                            Toutes les commandes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setDeliveryOrders}>
                        <Text className='p-2 font-bold text-gray-700 shadow border border-gray-200 rounded-xl'>
                            Livraisons
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setClickCollectOrders}>
                        <Text className='p-2 font-bold text-gray-700 shadow border border-gray-200 rounded-xl'>
                            Click&Collect
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setCompletedOrders}>
                        <Text className='p-2 font-bold text-green-500 shadow border border-gray-200 rounded-xl'>
                            Livrées
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setCancelledOrders}>
                        <Text className='p-2 font-bold text-red-500 shadow border border-gray-200 rounded-xl'>
                            Annulées
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setRefundedOrders}>
                        <Text className='p-2 font-bold text-blue-500 shadow border border-gray-200 rounded-xl'>
                            Remboursées
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
            <ScrollView>
                <SafeAreaView>
                    <View className=' '>
                        {filter.length != 0? filter.map( (order, index ) =>(
                            <OrderCard
                                key={index}
                                order={order}
                            />

                        )) : <Text>Pas de commandes à afficher</Text>}
                    </View>
                </SafeAreaView>
            </ScrollView>
        </SafeAreaView>
    );
};


export default OrderHistory;