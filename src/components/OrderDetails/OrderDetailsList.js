import React from "react";
import { DataTable } from "react-native-paper";


const OrderDetailsList = ({orderItems}) =>{

return(

<DataTable>
    <DataTable.Header>
        <DataTable.Title className='basis-1/6' >Nom du Produit</DataTable.Title>
        <DataTable.Title>Qté</DataTable.Title>
        <DataTable.Title>Prix/u</DataTable.Title>
        <DataTable.Title>Unité</DataTable.Title>
        <DataTable.Title>Total</DataTable.Title>
    </DataTable.Header>

    {orderItems.map((item, index)=>(
    <DataTable.Row key={index}>
        <DataTable.Cell className='basis-1/6'>{item.productName}</DataTable.Cell>
        <DataTable.Cell >{item.productQuantity}</DataTable.Cell>
        <DataTable.Cell >{item.productPrice}€</DataTable.Cell>
        <DataTable.Cell>{item.productUnit}</DataTable.Cell>
        <DataTable.Cell>{item.subTotal}€</DataTable.Cell>
    </DataTable.Row>
    ))}
</DataTable>
)
}

export default OrderDetailsList;