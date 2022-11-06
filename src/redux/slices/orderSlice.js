import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderList : [],        //Liste des commandes
    orderHistory: []       //Historique des commandes
}

const orderSlice = createSlice({  //Création du slice
  name: 'orderList',                     //Nom du slice
  initialState,                          //Etat initial
  reducers: {                           //Fonctions de modification de l'état

    loadOrderList(state, action) {
        state.orderList = action.payload;
    },
    loadOrderHistoryList(state, action) {
        state.orderHistory = action.payload;
    },
  },
})

export const { loadOrderList, loadOrderHistoryList } = orderSlice.actions
export const exportedOrderStore = (state) => state.orderStore.orderList;
export const exportedOrderHistoryStore = (state) => state.orderStore.orderHistory;
export const orderReducer = orderSlice.reducer;