import React, {useEffect, useState} from 'react';
import {Modal, Button, SafeAreaView, FlatList, TextInput, View} from 'react-native'
import {useDispatch, useSelector} from "react-redux";
import ProductForm from "../../components/Product/ProductForm";
import {exportedProductStore} from "../../redux/slices/productSlice";
import ProductCard from "../../components/Product/ProductCard";
import strings from "../../utils/res/strings";
import {loadProductList} from "../../dataAccesLayer/repositoryJCmendes/ProductRepo";
import {loadActiveCategories, loadAllCategories} from "../../dataAccesLayer/repositoryJCmendes/CategoriesRepo";


const Product = ({navigation}) => {
    const dispatch = useDispatch();
    const products = useSelector(exportedProductStore);

    const [addForm, setAddForm] = React.useState(false);
    const showFormModal = () => setAddForm(true);
    const hideFormModal = () => setAddForm(false);

    const [query, setQuery] = useState('');
    const filteredProducts = products.filter( x =>
        x.productName.toLowerCase().includes(query.toLowerCase()) || x.productPrice.toString().includes(query));

    useEffect(() => {
        loadProductList(dispatch);
        loadActiveCategories(dispatch);
        loadAllCategories(dispatch);
    }, []);

    return (
        <SafeAreaView className='flex-1'>

            <View className='flex-row justify-evenly m-1'>
                <Button className='w-full basis-1/2 grow'
                       onPress={showFormModal}
                       title='Ajouter un produit'/>
                <Button className='w-full basis-1/2 grow'
                        onPress={() => navigation.navigate(strings.tabs.categories)}
                        title='Gerer les categories'/>
            </View>

            <TextInput className= 'w-full items-center p-3 text-sm border border-gray-400 rounded-lg'
                       placeholder='Chercher un produit'
                       onChangeText={setQuery}
                       value={query}
            />

            <Modal className=''
                   animationType='slide'
                   visible={addForm}
                   onDismiss={hideFormModal}>
                <Button onPress={hideFormModal} title='Fermer'/>
                <ProductForm hideModal={hideFormModal}/>
            </Modal>

            <FlatList data={filteredProducts} renderItem={({item}) => <ProductCard product={item}/> }/>
        </SafeAreaView>
    );
};
export default Product;
