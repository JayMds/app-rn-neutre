import React from 'react';
import {Text, TextInput, View} from "react-native";
import {Controller} from "react-hook-form";

const CustomInput = ({label, inputName, control, rules={} ,
                         editable = true, keyboardType = 'default'}) => {
    return (

            <View className='items-center'>
                <Text className='my-1'>{label}</Text>
                <Controller
                    name={inputName}
                    control={control}
                    rules={rules}
                    render={({field: {onChange, onBlur, value}, fieldState:{error}}) => (
                            <TextInput
                                keyboardType={keyboardType}
                                className={!error? 'w-full items-center p-3 text-sm border border-gray-400 rounded-lg'
                                    : 'w-full items-center p-3 text-sm border border-red-500 rounded-lg '}
                                placeholder={label}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                editable={editable}
                               />
                    )}/>
            </View>
    );
};



export default CustomInput;
