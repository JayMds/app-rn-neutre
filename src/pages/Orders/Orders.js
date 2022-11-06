import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, View, Text, ScrollView, TouchableOpacity} from 'react-native';

import OrderList from "../../components/Order/OrderList";
import {useDispatch, useSelector} from "react-redux";
import { useFocusEffect} from "@react-navigation/native";
import AlarmModule from "../../components/elements/AlarmModule";
import {exportedOrderHistoryStore, exportedOrderStore} from "../../redux/slices/orderSlice";
import {getCurrentOrders, loadOrderHystory, loadOrderList} from "../../dataAccesLayer/repositoryJCmendes/OrderRepo";
import {findLatestOrderID} from "../../utils/tools/compareArray";



const Orders = () => {

    const dispatch = useDispatch();
    const orders = useSelector(exportedOrderStore);
    const closedOrders = useSelector(exportedOrderHistoryStore);

    /**
     * COUNTERS
     */
    const [orderCount, setOrderCount] = useState(0);
    const [orderAcceptedCount, setOrderAcceptedCount] = useState(0);
    const [orderPendingCount, setOrderPendingCount] = useState(0);
    const [orderReadyForPickUpCount, setOrderReadyForPickUpCount] = useState(0);
    const [orderReadyForDeliveryCount, setOrderReadyForDeliveryCount] = useState(0);
    const [declinedOrder, setDeclinedOrder] = useState(0);
    const [totalOrder, setTotalOrder] = useState(0);

    /**
     * FILTERS
     */
    const [filter, setFilter] = useState(orders);
    const acceptedOrders = orders.filter( o => o.orderProgressStatus === 8);
    const pendingOrders = orders.filter( o => o.orderProgressStatus === 2);
    const readyForPickUpOrders = orders.filter( o => o.orderProgressStatus === 4);
    const readyForDeliveryOrders = orders.filter( o => o.orderProgressStatus === 3);

    /**
     *Fonctions
     */
    function setAllOrders() {
        setFilter(orders)
        console.log(filter)
    }
    function setAcceptedOrders() {
        setFilter(acceptedOrders)
        console.log(filter)
    }
    function setPendingOrders() {
        setFilter(pendingOrders)
        console.log(filter)
    }
    function setReadyForPickUp() {
        setFilter(readyForPickUpOrders)
        console.log(filter)
    }
    function setReadyForDelivery() {
        setFilter(readyForDeliveryOrders)
        console.log(filter)
    }

    /**
     * A chaque actualisation de deps 'orders':
     * -definit les states de comptage selon orders
     * -si une nouvelle commande est detectée, affiche la liste 'toute les commandes'
     */
    const lastOrderID = useRef(0);
    useEffect(() => {
        if(orders !== []){
            const res = findLatestOrderID(orders);
            if (res > lastOrderID.current) {
                setFilter(orders)
                lastOrderID.current = res
            }
        }
        setOrderCount(orders.length);
        setTotalOrder(orders.length + closedOrders.length);
        setOrderAcceptedCount(orders.filter(order => order.orderProgressStatus === 8).length);
        setOrderPendingCount(orders.filter(order => order.orderProgressStatus === 2).length);
        setOrderReadyForPickUpCount(orders.filter(order => order.orderProgressStatus === 4).length);
        setOrderReadyForDeliveryCount(orders.filter(order => order.orderProgressStatus === 3).length);
        setDeclinedOrder(closedOrders.filter(order => order.orderProgressStatus === 7).length);
    }, [orders]);

    /**
     *  A chaque visite de la page,
     *  charge la liste des commandes et applique le filtre
     *  'toutes les commandes'
     */
    useFocusEffect(
        React.useCallback(()=>{
            loadOrderHystory(dispatch)

            loadOrderList(dispatch)
            getCurrentOrders().then((response) => {setFilter(response)})

        }, [])
    )

    useEffect(() => {
        loadOrderList(dispatch)
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white ">
            <AlarmModule/>
            <View className = 'shadow-lg rounded-xl '>

                <View className='m-1 flex-wrap flex-row justify-evenly rounded-xl'>
                    <TouchableOpacity onPress={setAllOrders}>
                        <Text className='p-2 font-bold text-gray-700 shadow border border-gray-200 rounded-xl'>
                            Toutes les commandes {orderCount}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setAcceptedOrders}>
                        <Text className='p-2 font-bold text-green-500 shadow border border-gray-200 rounded-xl'>
                            Commandes acceptés {orderAcceptedCount}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setPendingOrders}>
                        <Text className='p-2 font-bold text-yellow-500 shadow border border-gray-200 rounded-xl'>
                            En cours {orderPendingCount}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setReadyForDelivery}>
                        <Text className='p-2 font-bold text-red-500 shadow border border-gray-200 rounded-xl'>
                            Prêtes pour la livraison {orderReadyForDeliveryCount}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setReadyForPickUp}>
                        <Text className='p-2 font-bold text-blue-500 shadow border border-gray-200 rounded-xl'>
                            Prêtes pour Click&Collect {orderReadyForPickUpCount}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="m-1 flex-row rounded">
                    <View className="basis-1/3">
                        <Text className='p-2 font-bold text-gray-700 border border-gray-200'>
                            Reçue: {orderCount}
                        </Text>
                    </View>
                    <View className="basis-1/3">
                        <Text className='p-2 font-bold text-gray-700 border border-gray-200'>
                            Refusées: {declinedOrder}
                        </Text>
                    </View>
                    <View className="basis-1/3">
                        <Text className='p-2 font-bold text-gray-700 border border-gray-200'>
                            Total: {totalOrder}
                        </Text>
                    </View>
                </View>

            </View>

            <ScrollView>
                <OrderList filter={filter}/>
            </ScrollView>

        </SafeAreaView>
    );
};


export default Orders;