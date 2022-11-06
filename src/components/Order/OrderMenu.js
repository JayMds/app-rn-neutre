import React from 'react';
import { Text, TouchableOpacity, View} from "react-native";


function onPress() {

}

const OrderMenu = ({orderCount, orderAcceptedCount, orderPendingCount, orderReadyForDeliveryCount, orderReadyForPickUpCount,setAllOrders}) => {

    return (
            <View className='m-1 flex-wrap flex-row justify-evenly  rounded-xl '>
                <TouchableOpacity onPress={setAllOrders}>
                    <Text className='p-2 font-bold text-gray-700 shadow border border-gray-200 rounded-xl'>
                        Toutes les commandes {orderCount}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPress}>
                    <Text className='p-2 font-bold text-green-500 shadow border border-gray-200 rounded-xl'>
                        Commandes acceptés {orderAcceptedCount}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPress}>
                    <Text className='p-2 font-bold text-yellow-500 shadow border border-gray-200 rounded-xl'>
                        En cours {orderPendingCount}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPress}>
                    <Text className='p-2 font-bold text-red-500 shadow border border-gray-200 rounded-xl'>
                        Prêtes pour la livraison {orderReadyForDeliveryCount}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPress}>
                    <Text className='p-2 font-bold text-blue-500 shadow border border-gray-200 rounded-xl'>
                        Prêtes pour Click&Collect {orderReadyForPickUpCount}
                    </Text>
                </TouchableOpacity>
            </View>
    );
};

export default OrderMenu;
