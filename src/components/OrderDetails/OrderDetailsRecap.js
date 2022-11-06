import React from "react"
import {Text, TextInput, View} from "react-native"


 const OrderDetailsRecap = ({orderDetails}) =>{
            const date = new Date(orderDetails.scheduleDate)
            const tab = date.toLocaleDateString().split("/")
            const dateFormated = tab[1] + '/' + tab[0] + '/' + tab[2]
return(

    <View  className="flex flex-row flex-wrap items-center ">
        <Text className="my-1 font-bold basis-1/2">Nom du client:</Text>
        <Text className="my-1 basis-1/2">{orderDetails.customerName}</Text>
        <Text className="my-1 font-bold basis-1/2">Adresse:</Text>
        <Text className="my-1 basis-1/2">{orderDetails.completeAddress}</Text>
        <Text className="my-1 font-bold basis-1/2">Numéro de téléphone:</Text>
        <Text className="my-1 basis-1/2">{orderDetails.mobileNumber}</Text>
        <Text className="my-1 font-bold basis-1/2">Type:</Text>
            {orderDetails.deliveryMethod == 1 ? <Text className='text-blue-500'>Click & Collect</Text> :
                <Text className='text-red-500'>Livraison</Text>}
        <Text className="my-1 font-bold basis-1/2">Date de livraison:</Text>
        <Text className="my-1 basis-1/2">{dateFormated}</Text>
        <Text className="my-1 font-bold basis-1/2">Montant Total:</Text>
        <Text className="my-1 basis-1/2">{orderDetails.orderGrossAmount}€</Text>

        <Text className="my-1 font-bold basis-1/2">Statut de la commande:</Text>
        {orderDetails.orderProgressStatus === 1 && <Text className=''>Attente Acceptation</Text>}
        {orderDetails.orderProgressStatus === 2 && <Text className='text-green-500'>Préparation en cours</Text>}
        {orderDetails.orderProgressStatus === 3 && <Text className='text-green-500'>Préte pour la livraison</Text>}
        {orderDetails.orderProgressStatus === 4 && <Text className='text-green-500'>Prête pour Click&Collect</Text>}
        {orderDetails.orderProgressStatus === 5 && <Text className='text-green-500'>Complétée</Text>}
        {orderDetails.orderProgressStatus === 6 && <Text className='text-red-500'>Annulée</Text>}
        {orderDetails.orderProgressStatus === 7 && <Text className='text-blue-500'>Remboursée/Refusée</Text>}
        {orderDetails.orderProgressStatus === 8 && <Text className='text-blue-500'>Acceptée</Text>}
        {orderDetails.orderProgressStatus === 9 && <Text className='text-blue-500'>Hors Traitement</Text>}
        <Text className="">({orderDetails.orderProgressStatus})</Text>
            <View className='my-1 flex w-full'>
                    <Text className="font-bold">Commentaires de la commande</Text>
                    <TextInput editable={false} multiline={true} numberOfLines={4} className= "border-solid border-2 " style={{textAlignVertical : 'top'}} >{orderDetails.orderNote}</TextInput>
            </View>
    </View>
)
}
export default OrderDetailsRecap;