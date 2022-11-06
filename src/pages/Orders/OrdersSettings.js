import React, {useState} from 'react';
import {Button, SafeAreaView, Text, ToastAndroid, View} from "react-native";
import CustomInput from "../../components/elements/CustomInput";
import {useForm} from "react-hook-form";
import {Checkbox} from "react-native-paper";

import {useFocusEffect} from "@react-navigation/native";
import {getUserShop, postShopConfig} from "../../dataAccesLayer/repositoryJCmendes/ShopConfigRepo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrdersSettings = () => {

    const [userProfile, setUserProfile] = useState([]);
    const [deliveryEnabled, setDeliveryEnabled] = useState(true);
    const [pickUpEnabled, setPickUpEnabled] = useState(true);

    const {control, handleSubmit, reset, formState: {errors} } = useForm({
        defaultValues: ''
    })

    useFocusEffect(
        React.useCallback(()=> {
            getUserShop(setUserProfile);
            reset({
                preparationTime: userProfile.preparationTime,
                preparationTimeForDelivery: userProfile.preparationTimeForDelivery,
            })
            switch (userProfile.deliveryMethod) {
                case 0: setDeliveryEnabled(true);
                    setPickUpEnabled(true);
                    break;
                case 1: setDeliveryEnabled(false);
                    setPickUpEnabled(true);
                    break;
                case 2: setDeliveryEnabled(true);
                    setPickUpEnabled(false);
                    break;
            }

        }, [userProfile.deliveryMethod])
    )

   async function onSubmit(data) {
        if (pickUpEnabled && deliveryEnabled) {
            data.deliveryMethod = 0
        } else if(pickUpEnabled == false && deliveryEnabled == true){
            data.deliveryMethod = 2
        } else if (pickUpEnabled == true && deliveryEnabled == false){
            data.deliveryMethod = 1
        } else if (!pickUpEnabled && !deliveryEnabled){
            ToastAndroid.show("Vous devez choisir au moins un mode de livraison",ToastAndroid.LONG)
         return null;
        }

        data.shopId = await AsyncStorage.getItem('ShopID')
        await postShopConfig(data);
        console.log(data)
   }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <>
                <View>
                    <CustomInput
                    inputName={'preparationTime'}
                    label={'Temps de préparation Click&Collect en minutes'}
                    control={control}
                    />
                    <CustomInput
                        inputName={'preparationTimeForDelivery'}
                        label={'Temps de préparation pour la livraison en minutes'}
                        control={control}
                    />
                    <View className='flex-row items-center'>
                        <Text>En livraison</Text>

                        <Checkbox
                            status={deliveryEnabled ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setDeliveryEnabled(!deliveryEnabled);
                            }}
                        />
                    </View>
                    <View className='flex-row items-center'>
                        <Text>A emporter</Text>

                        <Checkbox
                            status={pickUpEnabled? 'checked' : 'unchecked'}
                            onPress={() => {
                                setPickUpEnabled(!pickUpEnabled);
                            }}
                        />
                    </View>
                    <Button title='Envoyer' onPress={handleSubmit(onSubmit)}/>
                </View>
            </>
        </SafeAreaView>
    );
};

export default OrdersSettings;
