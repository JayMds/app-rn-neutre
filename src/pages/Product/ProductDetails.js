import React, {useEffect, useState} from 'react';
import {Button, Image, SafeAreaView, ScrollView, Text, ToastAndroid, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";

import strings from "../../utils/res/strings";
import {Checkbox, Switch, Button as B} from "react-native-paper";
import { useForm} from "react-hook-form";
import {useFocusEffect} from "@react-navigation/native";
import CustomInput from "../../components/elements/CustomInput";
import {
    editProduct,
    loadProductDetails,
    loadProductList,
    uploadProductIcon
} from "../../dataAccesLayer/repositoryJCmendes/ProductRepo";
import {exportedActualProduct} from "../../redux/slices/productSlice";
import DropDownPicker from "react-native-dropdown-picker";
import {
    exportedActiveProductCategoryStore,
} from "../../redux/slices/productCategorySlice";
import * as ImagePicker from "expo-image-picker";
import {manipulateAsync} from "expo-image-manipulator";


const ProductDetails = ({route, navigation}) => {
    const dispatch = useDispatch();
    const product = useSelector(exportedActualProduct);
    const categories = useSelector(exportedActiveProductCategoryStore);
    /**
     * Custom Functions
     */
    function updatePercentage() {
        const temp = parseFloat(getValues('productPrice')) + (parseFloat(getValues('percentage')) * parseFloat(getValues('productPrice')) /100);
        const result = temp.toString();
        setValue('productPrice', result);
    }
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if(!result.cancelled){
            const manipResult = await manipulateAsync(
                result.uri, [
                    {
                        resize: {
                            width: 992,
                            height : 607
                        },
                    }
                ]
            )
            setImage(manipResult.uri)
        }
    };
    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
        });

        console.log(result);

        if(!result.cancelled){
            const manipResult = await manipulateAsync(
                result.uri, [
                    {
                        resize: {
                            width: 992,
                            height : 607
                        },

                    }
                ]
            )
            setImage(manipResult.uri)
        }
    };

    const onSubmit = async data => {
        data.isSale = isSale;
        data.isUnsold = isUnsold;
        data.isFragile = isFragile;
        data.isBigBasket = isBigBasket;
        data.isPanier = isPanier;
        data.productCategoryId = idValue;
        if (active){
            if (isStock){data.productStatus = 1;}
            else {data.productStatus = 3;}
        } else {
            data.productStatus = 2;
        }
        if (image != null){
            if(image.startsWith("file:///data/")){
                data.productIcon = await uploadProductIcon(image);
            }
        } else{
            ToastAndroid.show('Aucune image choisie',ToastAndroid.LONG)
        }
        console.log(data)
        await editProduct(data)
        navigation.navigate(strings.tabs.product)
        await loadProductList(dispatch)
    };
    /**
     * Hook Form control
     */
    const { control, handleSubmit, formState: { errors }, reset, setValue, getValues} = useForm({
        defaultValues:''
    });
    /**
     * DropList States
     */
    const [open, setOpen] = useState(false);
    const [idValue, setIdValue] = useState(product.productCategoryId);
    const [items, setItems] = useState([]);
    /**
     * Product Checkboxes & Switch States
     */
    const [image, setImage] = useState(null);
    const [isSale, setIsSale] = React.useState(product.isSale);
    const [isUnsold, setIsUnsold] = React.useState(product.isUnsold);
    const [isFragile, setIsFragile] = React.useState(product.isFragile);
    const [isPanier, setIsPanier] = React.useState(product.isPanier);
    const [isBigBasket, setIsBigBasket] = useState(product.isBigBasket);
    const [active, setActive] = useState(product.productStatus != 2);
    const [isStock, setIsStock] = useState (product.productStatus == 1);
    const toggleInStock = () => setIsStock(previousState => !previousState)
    const toggleActive = () => setActive(x => !x)

    useEffect(()=>{
        setIdValue(product.productCategoryId)
        setIsSale(product.isSale)
        setIsUnsold(product.isUnsold)
        setIsFragile(product.isFragile)
        setIsPanier(product.isPanier)
        setIsBigBasket(product.isBigBasket)
        setIsStock(product.productStatus == 1)
        setActive(product.productStatus != 2)
        reset({
            productRecordId: product.productRecordId? product.productRecordId.toString(): null,
            productId: product.productId,
            shopId: product.shopId,
            productName: product.productName,
            productDesc: product.productDesc,
            productIcon: product.productIcon,
            productPrice: product.productPrice? product.productPrice.toString(): null,
            productPricePerKG: product.productPrice? product.productPricePerKG.toString():null,
            previousPrice: product.previousPrice? product.previousPrice.toString(): null,
            productUnit : product.productUnit,
            productTaxValue: product.productTaxValue? product.productTaxValue.toString(): null,
            productStatus: product.productStatus,
        })
        const itemArray = [];
        categories.map((c) => {
            const label = c.productCategoryName;
            const value = c.productCategoryId;
            itemArray.push({label: label, value: value})
        })
        setItems(itemArray);
    }, [product])

        useFocusEffect(
            React.useCallback( () => {
                setImage(null)
                loadProductDetails(dispatch, route.params.productRecordId);

                const itemArray = [];
                categories.map((c) => {
                    const label = c.productCategoryName;
                    const value = c.productCategoryId;
                    itemArray.push({label: label, value: value})
                })
                setItems(itemArray);
            }, [route.params.productRecordId])
        );

    return (

        <SafeAreaView className='flex-1'>
            {/*todo: inserer les custom input avec gestion des erreurs*/}
            <ScrollView>

                <Button title='RETOUR' onPress={() => navigation.navigate(strings.tabs.product)}/>

                <View className='m-5 items-center'>
                    <Image className='border rounded-xl '
                           source={image? {uri: image} : {uri: product.productIcon}}
                           style={strings.imageSize.detailProductMedium}/>

                    <View className='flex-row w-full justify-evenly mt-8'>
                        <B className='bg-emerald-400' icon='camera' mode='contained' onPress={takePhoto} textColor='white'>Photo</B>
                        <B className='bg-emerald-400' icon='folder-multiple-image' mode='contained' onPress={pickImage} >Gallerie</B>
                    </View>
                </View>

                    <View className='flex-row flex-wrap items-center justify-center space-y-3 p-5'>

                        <View className='flex-row items-center justify-center'>
                            <Text>En Stock: </Text>
                            <Switch value={isStock} onValueChange={toggleInStock}></Switch>
                            <Text>Actif: </Text>
                            <Switch value={active} onValueChange={toggleActive}></Switch>
                        </View>

                    <View className='flex-row w-full items-center'>

                        <View className='basis-1/3'>
                            <CustomInput
                                inputName='productRecordId'
                                label='ID produit (tmp)'
                                control={control}
                                rules={{required: true}}
                                errors={errors}
                                editable={false}
                            />
                            {errors.productRecordId && <Text className='text-red-500'>{strings.errors.required}</Text>}
                        </View>

                        <View className='flex basis-2/3'>
                            <CustomInput
                                         inputName='productName'
                                         label='Nom du produit'
                                         control={control}
                                         rules={{required: true}}
                                         errors={errors}
                                         />
                            {errors.productName &&  <Text className='text-red-500'>{strings.errors.required}</Text>}
                        </View>

                    </View>

                        <View className='w-full grow'>
                            <CustomInput className='p-3 text-sm border border-gray-300 rounded-lg'
                                         inputName="productDesc"
                                         label='Description du produit'
                                         control={control}
                                         rules={{required: true}}
                                         errors={errors}
                            />
                            {errors.productDesc &&  <Text className='text-red-500'>{strings.errors.required}</Text>}
                        </View>
                        <DropDownPicker
                            listMode={'SCROLLVIEW'}
                            placeholder='Categorie du produit'
                            open={open}
                            value={idValue}
                            items={items}
                            setOpen={setOpen}
                            setValue={setIdValue}
                            setItems={setItems}
                        />
                        <View className='w-full grow hidden'>
                            <CustomInput className='p-3 text-sm'
                                       inputName='productIcon'
                                       label="url"
                                       control={control}
                                       errors={errors}
                            />
                        </View>
                        <View className='basis-1/3 grow'>
                            <><CustomInput className='grow'
                                inputName="productPrice"
                                label='Prix(€)'
                                control={control}
                                rules={{required: true}}
                                errors={errors}
                                keyboardType='numeric'
                                valueAsNumber={true}

                            />
                                {errors.productPrice && <Text className='text-red-500'>{strings.errors.required}</Text>}
                            </>
                        </View>

                        <View className='basis-1/3 w-full grow items-center'>
                            <CustomInput inputName='percentage'
                                            control={control}
                                            label='Hausse(%)'/>
                        </View>
                        <Button className='h-full grow' title={'+'} onPress={updatePercentage}/>
                        <View className='w-full'>
                            <CustomInput className=' '
                                         inputName="productPricePerKG"
                                         label='Prix au kilo (€)'
                                         control={control}
                                         errors={errors}
                                         keyboardType={'numeric'}
                            />
                            {errors.productPricePerKG && <Text className='text-red-500'>{strings.errors.required}</Text>}
                        </View>
                        <View className='w-full'>
                            <CustomInput className=''
                                         inputName="previousPrice"
                                         label='Prix initial'
                                         control={control}
                                         errors={errors}
                                         keyboardType={'numeric'}
                                         editable={isSale == true }
                            />
                            {errors.previousPrice && <Text className='text-red-500'>{strings.errors.required}</Text>}
                        </View>
                        <View className='w-full grow'>
                            <CustomInput
                                         inputName="productUnit"
                                         label='Unité/Portion'
                                         control={control}

                            />
                        </View>
                        <View className='w-full grow'>
                            <CustomInput className='p-3 text-sm border border-gray-300 rounded-lg'
                                         inputName="productTaxValue"
                                         label='TVA(%)'
                                         control={control}
                                         rules={{required: true}}
                                         keyboardType='numeric'
                            />
                            {errors.productTaxValue &&  <Text className='text-red-500'>{strings.errors.required}</Text>}
                        </View>
                        <View className='w-full grow hidden'>
                            <CustomInput inputName="productId"
                                         label="ID Produit (temp)"
                                         control={control}
                                         errors={errors}
                            />
                        </View>
                        <View className='w-full grow hidden'>
                            <CustomInput inputName="shopId"
                                         label="ID Commerçant (temp)"
                                         control={control}
                                         errors={errors}
                            />
                        </View>

                        <View className='flex-row '>
                            <View className='flex-row items-center'>
                                <Text>Promotion</Text>
                                <Checkbox
                                    status={isSale ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setIsSale(!isSale);
                                    }}
                                />
                            </View>
                            <View className='flex-row items-center'>
                                <Text>Produit Invendu</Text>

                                <Checkbox
                                    status={isUnsold ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setIsUnsold(!isUnsold);
                                    }}
                                />
                            </View>
                        </View>

                        <View className='flex-row flex-wrap '>
                            <View className='flex-row items-center'>
                            <Text>Produit Fragile</Text>

                            <Checkbox
                                status={isFragile ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setIsFragile(!isFragile);
                                }}
                            />
                            </View>
                            <View className='flex-row items-center'>
                                <Text>Panier</Text>

                                <Checkbox
                                    status={isPanier ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setIsPanier(!isPanier);
                                    }}
                                />
                            </View>

                        </View>
                        <View className='flex-row items-center  '>
                            <Text>Click&Collect Seulement</Text>

                            <Checkbox
                                status={isBigBasket? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setIsBigBasket(!isBigBasket);
                                }}
                            />
                        </View>
                        {/*Dispatch: */}
                            <Button title='Envoyer' onPress={handleSubmit(onSubmit)}/>
                        </View>
                    </ScrollView>
        </SafeAreaView>
    );
};

export default ProductDetails;
