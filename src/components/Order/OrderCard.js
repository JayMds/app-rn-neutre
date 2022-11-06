import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {ShoppingBagIcon, TruckIcon} from "react-native-heroicons/outline";
import strings from "../../utils/res/strings";
import {ChevronDoubleRightIcon, } from "react-native-heroicons/solid";
import {useNavigation} from "@react-navigation/native";

/**
 * Carte de d'affichage d'une commande: données dynamiques injectés via 'props'
 * en provenance du store Redux (product.producList) ainsi le composant peut être utilisé
 * dans une fonction map
 */

function OrderCard({order}) {

    const date = new Date(order.deliveryDate)
    const tab = date.toLocaleDateString().split("/")
    const dateFormated = tab[1] + '/' + tab[0] + '/' + tab[2]

    const navigation = useNavigation();

    function onPress() {
        navigation.navigate(strings.tabs.orderDetails, order)
    }

    return (
        <SafeAreaView className='w-full p-1'>

                <View className='flex-row border border-gray-300 h-39 shadow rounded p-2'>

                    <View className='flex'>

                        <View className='flex-row items-center'>
                            <Text className='font-bold'> Commande n°: {order.orderID} </Text>
                            {order.deliveryTypeId === 1 ?
                                <ShoppingBagIcon size={30} color={strings.colors.cyan}/> :
                                <TruckIcon size={30} color={strings.colors.cyan}/>}
                        </View>

                        <View className=' flex-row'>
                            <Text className='font-bold'>Client: </Text>
                            <Text>{order.customerName}</Text>
                        </View>

                        <View className=' flex-row'>
                            <Text className='font-bold'>Montant Total: </Text>
                            <Text>{order.orderGrossAmount}€ </Text>
                        </View>

                        <View className=' flex-row'>
                            <Text className='font-bold'>Type: </Text>
                            {order.deliveryTypeId === 1 ? <Text className='font-bold text-blue-500'>Click & Collect</Text> :
                                <Text className='font-bold text-red-500'>Livraison</Text>}
                        </View>

                        <View className=' flex-row'>
                            <Text className='font-bold'>Vendeur: </Text>
                            <Text>{order.shopName}</Text>
                        </View>

                        <View className=' flex-row'>
                            <Text className='font-bold'>Date de Livraison: </Text>
                            <Text>{dateFormated}</Text>
                        </View>

                        <View className=' flex-row'>
                            <Text className='font-bold'>Status: </Text>
                            <Text className='font-bold'>
                                {order.orderProgressStatus === 1 && <Text className='text-green-500'>Attente Acceptation</Text>}
                                {order.orderProgressStatus === 2 && <Text className='text-yellow-500'>Préparation en cours</Text>}
                                {order.orderProgressStatus === 3 && <Text className='text-green-500'>Préte pour la livraison</Text>}
                                {order.orderProgressStatus === 4 && <Text className='text-green-500'>Prête pour Click&Collect</Text>}
                                {order.orderProgressStatus === 5 && <Text className='text-green-500'>Complétée</Text>}
                                {order.orderProgressStatus === 6 && <Text className='text-red-500'>Annulée</Text>}
                                {order.orderProgressStatus === 7 && <Text className='text-blue-500'>Remboursée/Refusée</Text>}
                                {order.orderProgressStatus === 8 && <Text className='text-green-500'>Acceptée</Text>}
                                {order.orderProgressStatus === 9 && <Text className='text-blue-500'>Hors Traitement</Text>}
                            </Text>
                        </View>

                    </View>
                    <View className='justify-center p-10' >
                        <TouchableOpacity onPress={onPress}>
                            <ChevronDoubleRightIcon size={45} color={strings.colors.cyan}/>
                        </TouchableOpacity>
                    </View>
                </View>

        </SafeAreaView>
    );
}
export default OrderCard;
