import React, { useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {ChevronDoubleRightIcon} from "react-native-heroicons/solid";

import strings from "../../utils/res/strings";
import {useFocusEffect, useNavigation} from "@react-navigation/native";



/**
 * Carte de d'affichage d'une commande: données dynamiques injectés via 'props'
 * en provenance du store Redux (product.producList) ainsi le composant peut être utilisé
 * dans une fonction map
 */

function ProductCard({product}) {
    const [isSwitched, setIsSwitched] = useState (product.productStatus == 1 ? true : false );
    const toggleSwitch = () => setIsSwitched(previousState => !previousState)
    useFocusEffect(React.useCallback(()=>{
    setIsSwitched(product.productStatus == 1 ? true : false)
    }, []))
    
    const navigation = useNavigation();

    return (

        <View className='w-fit'>

                <View className='flex-row rounded shadow shadow-black items-center justify-center basis-1/3 p-2'>

                    <View className=' '>
                        <Image source={{uri: product.productIcon}} style={strings.imageSize.logo}
                        className=' rounded-xl'/>
                    </View>


                    <View className='flex items-center basis-2/3 text-center'>

                        <Text className='font-semibold text-lg text-center  '> {product.productName} </Text>
                        <Text className='text-2xl font-bold'> {product.productPrice}€ </Text>
                        {product.productStatus == '1'?
                            <Text className='text-green-500'>En Stock</Text> :
                            <Text className='text-red-500'>Epuisé</Text>}
                        <TouchableOpacity className={''} onPress={() => navigation.navigate(strings.tabs.productDetails, product)}>
                            <ChevronDoubleRightIcon
                                size={45}
                                color={strings.colors.cyan}/>
                        </TouchableOpacity>
                    </View>



                </View>

        </View>
    );
};
export default ProductCard;
