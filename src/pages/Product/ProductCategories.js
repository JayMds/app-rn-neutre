import React, {useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {Button, Modal, ScrollView, Text, TextInput, View} from "react-native";

import {useDispatch, useSelector} from "react-redux";
import {exportedProductCategoryStore} from "../../redux/slices/productCategorySlice";
import CustomInput from "../../components/elements/CustomInput";
import {useForm} from "react-hook-form";
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {addCategory, editCategory, loadActiveCategories} from "../../dataAccesLayer/repositoryJCmendes/CategoriesRepo";
import {loadAllCategories} from "../../dataAccesLayer/repositoryJCmendes/CategoriesRepo";
import {DataTable} from "react-native-paper";

function ProductCategories() {
    const dispatch = useDispatch();
    const categories = useSelector(exportedProductCategoryStore);

    useFocusEffect(
        React.useCallback(()=>{
            loadAllCategories(dispatch)
            console.log(categories)
        }, [categories.shopId])
    )
    /**
     * Hooks (form) et States
     */
    const { control, handleSubmit , setValue, reset, formState: { errors } } = useForm({
        defaultValues: ''
    });

    const [query, setQuery] = useState('');

    const [addCategoryForm, setAddCategoryAddForm] = React.useState(false);
    const [openEditCategoryForm, setOpenEditCategoryForm] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [selectListValue, setSelectListValue] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState([
        {label: 'Actif', value: true},
        {label: 'Inactif', value: false}
    ]);

    const showFormModal = () => {
        reset('');
        setAddCategoryAddForm(true)
    };
    const showEditFormModal = (categoryItem) => {
        setSelectedCategory(categoryItem)
        setSelectListValue(categoryItem.isActive)
        setValue('productCategoryName', categoryItem.productCategoryName.toString())
        console.log(categoryItem)
        setOpenEditCategoryForm(true);
    }
    const hideFormModal = () => setAddCategoryAddForm(false);
    const hideEditFormModal = () => setOpenEditCategoryForm(false);

    const addNewCategory = async data => {
        data.shopId = await AsyncStorage.getItem('ShopID')
        data.isActive = selectListValue;
        data.orderSequence = categories.length.toString();
        await addCategory(data)
        hideFormModal()
        await loadAllCategories(dispatch)
        await loadActiveCategories(dispatch)

    }
    const editPreviousCategory = async data => {
        data.productCategoryId = selectedCategory.productCategoryId
        data.shopId = await AsyncStorage.getItem('ShopID')
        data.isActive = selectListValue;
        data.orderSequence = selectedCategory.orderSequence;
        await editCategory(data)
        hideEditFormModal()
        await loadAllCategories(dispatch)
        await loadActiveCategories(dispatch)
    }
    const filteredCategories = categories.filter( x => x.productCategoryName.toLowerCase().includes(query.toLowerCase()));
    filteredCategories.sort((a) => a.isActive? -1 : 1)
    return (
        <>
            <Button title='Ajouter une catégorie' onPress={showFormModal}/>
            <TextInput className= 'w-full items-center p-3 text-sm border border-gray-400 rounded-lg'
                       placeholder='Recherche'
                       onChangeText={setQuery}
                       value={query}
            />
            <ScrollView scrollToOverflowEnabled={true}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title className='basis-1/6' >Nom de la catégorie</DataTable.Title>
                    <DataTable.Title className='basis-1/8'>Status</DataTable.Title>

                </DataTable.Header>


                    {filteredCategories.map((item, index)=>(
                        <DataTable.Row key={index}>
                            <DataTable.Cell className='basis-1/6' onPress={() => {showEditFormModal(item)}}>{item.productCategoryName}</DataTable.Cell>
                            <DataTable.Cell className='basis-1/8'>{item.isActive == true? 'Actif' : 'Inactif'}</DataTable.Cell>

                        </DataTable.Row>
                    ))}


            </DataTable>
        </ScrollView>
            {/*
            MODALS
            */}
            <Modal className=''
                   animationType='fade'
                   visible={addCategoryForm}
                   onDismiss={hideFormModal}
                transparent={true}>
                <View className=' h-[50%] top-12 bg-white items-center justify-center'>
                    <Text className="w-full text-center my-4 py-5 border border-gray-400 rounded-xl text-xl font-semibold">
                        Creer une catégorie de produit
                    </Text>
                    <Button onPress={hideFormModal} title='Fermer'/>
                    <CustomInput
                        label={'Nom de la Catégorie'}
                        inputName={'productCategoryName'}
                        control={control}
                    />
                    <DropDownPicker className=' '
                        open={open}
                        value={selectListValue}
                        items={items}
                        setOpen={setOpen}
                        setValue={setSelectListValue}
                        setItems={setItems}
                    />

                    <Button title='Ajouter' className={'bg-emerald-400'} onPress={handleSubmit(addNewCategory)}/>

                </View>
            </Modal>
            <Modal className=''
                   animationType='fade'
                   visible={openEditCategoryForm}
                   onDismiss={hideEditFormModal}
                   transparent={true}>
                <View className=' h-[50%]  top-12 bg-white items-center justify-center border-b border-gray-400 rounded-xl'>
                    <Text className="w-full text-center my-4 py-5 border border-gray-400 rounded-xl text-xl font-semibold">
                        Modifier une catégorie de produit
                    </Text>
                    <CustomInput
                        label={'Nom de la Catégorie'}
                        inputName={'productCategoryName'}
                        control={control}
                    />
                    <DropDownPicker className=' '
                                    open={open}
                                    value={selectListValue}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setSelectListValue}
                                    setItems={setItems}
                    />

                    <View className='flex-row'>
                        <Button title='Modifer' className={'bg-emerald-400'} onPress={handleSubmit(editPreviousCategory)}/>
                        <Button onPress={hideEditFormModal} title='Fermer'/>
                    </View>

                </View>
            </Modal>

        </>
    );
}

export default ProductCategories
