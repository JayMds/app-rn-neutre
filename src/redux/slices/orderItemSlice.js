import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    orderItemsList: []
}

const orderSlice = createSlice({
    name: 'orderItemsStore',
    initialState,
    reducers: {

        addToOrderItemList(state, action) {
            state.orderStore = [...state.orderStore, action.payload]
        },

        removeFromOrderList(state, action) {
            state.orders-=1
        },

    },
})

export const { addToOrderList, removeFromOrderList } = orderSlice.actions

export const exportedOrderItemStore = (state) => state.orderStore.orderItemsList;


export const orderItemReducer = orderSlice.reducer;