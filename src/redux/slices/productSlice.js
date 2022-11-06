import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    productList: [],         //Liste des données
    actualProduct:'',
}

const productSlice = createSlice({
    name: 'productList',
    initialState,
    reducers: {
        loadActualProduct: (state, action) => {
            state.actualProduct = action.payload;
        },
        loadProductList: (state, action) => {
            state.productList = action.payload;
        },

    },
})

export const { loadActualProduct, loadProductList } = productSlice.actions
export const exportedProductStore = (state) => state.productStore.productList;
export const exportedActualProduct = (state) => state.productStore.actualProduct;

export const productReducer = productSlice.reducer;