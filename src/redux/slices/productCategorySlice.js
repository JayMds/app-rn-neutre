import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    productCategoryList: [],        //Liste des catégories de produits (toutes)
    activeProductCategoryList: [],  //Liste des catégories de produits actives
}

const productCategorySlice = createSlice({
    name: 'productCategoryList',   //Nom du slice
    initialState,                  //Etat initial
    reducers: {
        //chargement de la liste des catégories de produits
        loadProductCategoryList: (state, action) => {
            state.productCategoryList = action.payload;
        },
        //chargement de la liste des catégories de produits actives
        loadActiveProductCategoryList: (state, action) => {
            state.activeProductCategoryList = action.payload;
        },
    },
})
// export des fonctions de chargement
export const { loadActiveProductCategoryList, loadProductCategoryList } = productCategorySlice.actions
// export des states (afin d'eviter d'appeler tout le store global)
export const exportedProductCategoryStore = (state) => state.productCategoryStore.productCategoryList;
export const exportedActiveProductCategoryStore = (state) => state.productCategoryStore.activeProductCategoryList;
// export du reducer (vers le store global)
export const productCategoryReducer = productCategorySlice.reducer;