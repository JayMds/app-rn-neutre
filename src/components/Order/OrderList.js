import React from 'react';

import OrderCard from "./OrderCard";
import {SafeAreaView, Text, View} from "react-native";

const OrderList = ({filter}) => {


    return (
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
    );
};

export default OrderList;

