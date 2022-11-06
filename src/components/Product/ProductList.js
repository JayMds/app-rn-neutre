import React from 'react';
import {useSelector} from "react-redux";
import ProductCard from "./ProductCard";
import {exportedProductStore} from "../../redux/slices/productSlice";
import {SafeAreaView, View} from "react-native";



const ProductList = () => {

    const products = useSelector(exportedProductStore);
    return (
        <SafeAreaView>
            <View className={''}>
                {products.map((item, index) => (

                        <ProductCard
                        key={index}
                        product={item}
                        />

            ))}
            </View>
        </SafeAreaView>
    );
};

export default ProductList;
