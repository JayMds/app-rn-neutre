import { configureStore } from '@reduxjs/toolkit';

import {orderReducer} from './slices/orderSlice.js';
import {productReducer} from './slices/productSlice.js';
import {orderItemReducer} from "./slices/orderItemSlice";
import {productCategoryReducer} from "./slices/productCategorySlice";

export const store = configureStore({
    reducer: {
        orderStore: orderReducer,
        orderItemStore: orderItemReducer,
        productStore: productReducer,
        productCategoryStore: productCategoryReducer,
    },
})