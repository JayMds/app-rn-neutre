import React, {useState} from 'react';
import {Image, SafeAreaView, ScrollView, Text, ToastAndroid, View} from "react-native";
import {Checkbox, Button, Button as B} from "react-native-paper";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import CustomInput from "../elements/CustomInput";
import strings from "../../utils/res/strings";
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {useFocusEffect} from "@react-navigation/native";
import {exportedActiveProductCategoryStore} from "../../redux/slices/productCategorySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {addProduct, loadProductList} from "../../dataAccesLayer/repositoryJCmendes/ProductRepo";
import {manipulateAsync} from "expo-image-manipulator";
import UploadShopIconDB from "../../dataAccesLayer/repositoryPierreBeney/UploadShopIconDB";

const ProductForm = ({hideModal}) => {
    const dispatch = useDispatch()
    const categories = useSelector(exportedActiveProductCategoryStore);

    useFocusEffect(
        React.useCallback(()=>{
            const itemArray = [];
            categories.map((c) => {
                const label = c.productCategoryName;
                const value = c.productCategoryId;
                itemArray.push({label: label, value: value})
            })
            setItems(itemArray);
        }, [])
    )

    /**
     * Custom Fonctions
     */
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        //console.log(result);

        if(!result.cancelled){
            const manipResult = await manipulateAsync(
                result.uri, [
                    {
                        resize : {
                            width : 992,
                            height : 607
                        }
                    }
                ]
            )
            setImage(manipResult.uri)
        }
    };
    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        permissionResult.granted = true;
        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }
        let result = await ImagePicker.launchCameraAsync({allowsEditing: true});

        //console.log(result);

        if(!result.cancelled){
            const manipResult = await manipulateAsync(
                result.uri, [
                    {
                        resize : {
                            width : 992,
                            height : 607

                        }
                    }
                ]
            )
            setImage(manipResult.uri)
        }
    };

    const onSubmit = async data => {
        // data contient les données du formulaire contrôlé via hook-form
        data.isSale = isSale;
        data.isUnsold = isUnsold;
        data.isFragile = isFragile;
        data.isBigBasket = isBigBasket;
        data.isPanier = isPanier;
        data.productCategoryId = value;
        data.previousPrice = "0";
        data.shopId = await AsyncStorage.getItem('ShopID');
        if (image != null ){
            if(image.startsWith("file:///data/")){
                data.productIcon = await UploadShopIconDB(image, data.shopId);
                console.log(data.productIcon)
            }
        } else {
            ToastAndroid.show("Aucune image définie",ToastAndroid.LONG)
            data.productIcon = strings.placeholderIMg;
        }
        await addProduct(data, dispatch)
        hideModal();
        await loadProductList(dispatch)
    };

    /**
     * Hooks form control
     */
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: ''
    });

    /**
     *Picker Drop List States
     */
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    const [image, setImage] = useState(null);
    /**
     * Product CheckBoxes States
     */
    const [isSale, setIsSale] = useState(false);
    const [isUnsold, setIsUnsold] = useState(false);
    const [isFragile, setIsFragile] = useState(false);
    const [isPanier, setIsPanier] = useState(false);
    const [isBigBasket, setIsBigBasket] = useState(false);

    return (

        <SafeAreaView className='flex-1'>
            <ScrollView>
            <View className='flex-row flex-wrap items-center space-y-3 p-5'>

                <View className='m-5 items-center'>
                    <Image className='border rounded-xl '
                           source={image? {uri: image} : {uri: strings.placeholderIMg}}
                           style={strings.imageSize.detailProductMedium}/>

                    <View className='flex-row w-full justify-evenly mt-8'>
                        <B className='bg-emerald-400' icon='camera' mode='contained' onPress={takePhoto} textColor='white'>Photo</B>
                        <B className='bg-emerald-400' icon='folder-multiple-image' mode='contained' onPress={pickImage} >Gallerie</B>
                    </View>
                </View>
                <View className='w-full'>
                    <CustomInput
                        inputName='productName'
                        label='Nom du produit'
                        control={control}
                        rules={{required: true, minLength: 3}}
                        errors={errors}
                    />
                    {errors.productName && <Text className='text-red-500'>{strings.errors.required}</Text>}
                </View>

                <View className='w-full'>
                    <CustomInput
                        inputName="productDesc"
                        label='Description du produit'
                        control={control}
                        rules={{required: true, minLength: 3}}
                        errors={errors}
                    />
                    {errors.productDesc && <Text className='text-red-500'>{strings.errors.required}</Text>}
                </View>

                <DropDownPicker
                    listMode={'SCROLLVIEW'}
                    placeholder='Categorie du produit'
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                />

                <View className='w-full'>
                    <CustomInput className=' '
                                 inputName="productPrice"
                                 label='Prix(€)'
                                 rules={{required: true}}
                                 control={control}
                                 errors={errors}
                                 keyboardType={'numeric'}
                    />
                    {errors.productPrice && <Text className='text-red-500'>{strings.errors.required}</Text>}
                </View>
                <View className='w-full'>
                    <CustomInput
                                 inputName="productPricePerKG"
                                 label='Prix au kilo (€)'
                                 control={control}
                                 errors={errors}
                                 keyboardType={'numeric'}
                    />
                    {errors.productPricePerKG && <Text className='text-red-500'>{strings.errors.required}</Text>}
                </View>
                <View className='w-full'>
                    <CustomInput className='p-3 text-sm border border-gray-300 rounded-lg'
                                 inputName="productUnit"
                                 label='Unité/Portion'
                                 control={control}
                                 rules={{required: true}}
                    />
                    {errors.productUnit && <Text className='text-red-500'>{strings.errors.required}</Text>}
                </View>
                <View className='w-full'>
                    <CustomInput className='p-3 text-sm border border-gray-300 rounded-lg'
                                 inputName="productTaxValue"
                                 label='TVA(%)'
                                 control={control}
                                 rules={{required: true}}
                                 keyboardType={'numeric'}
                    />
                    {errors.productTaxValue && <Text className='text-red-500'>{strings.errors.required}</Text>}
                </View>
                <View>
                    <View className='flex-row items-center'>
                    <Text>Promotion?</Text>
                    <Checkbox
                        status={isSale ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setIsSale(!isSale);
                        }}
                    />
                    </View>
                    <View className='flex-row items-center'>
                        <Text>Invendu?</Text>
                        <Checkbox
                            status={isUnsold ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setIsUnsold(!isUnsold);
                            }}
                        />
                    </View>
                </View>
                <View>
                    <View className='flex-row items-center'>
                        <Text>Fragile?</Text>
                        <Checkbox
                            status={isFragile ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setIsFragile(!isFragile);
                            }}
                        />
                    </View>
                    <View className='flex-row items-center'>
                        <Text>Panier?</Text>
                        <Checkbox
                            status={isPanier ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setIsPanier(!isPanier);
                            }}
                        />
                    </View>
                    <View className='flex-row items-center'>
                        <Text>BigBasket?</Text>
                        <Checkbox
                            status={isBigBasket? 'checked' : 'unchecked'}
                            onPress={() => {
                                setIsBigBasket(!isBigBasket);
                            }}
                        />
                    </View>
                </View>
                <Button className={'bg-emerald-400'} mode='contained'  onPress={handleSubmit(onSubmit)}>Valider</Button>
            </View>
        </ScrollView>
        </SafeAreaView>

    );
};

export default ProductForm;

