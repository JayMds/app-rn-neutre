import React, { useState } from "react";
import {View,Text, TouchableOpacity, Modal, Button, ScrollView} from "react-native"
import { DataTable } from "react-native-paper";
import {useFocusEffect} from "@react-navigation/native";
import GetReviews from "../../dataAccesLayer/repositoryPierreBeney/GetReviews";
import { TextInput } from "react-native-gesture-handler";



const ShopRatings = () =>{
    const [query,setQuery] = useState('')
    const [reviews,setReviews] = useState('')
    const [details,setDetails] = useState(false)
    const [modalData,setModalData] = useState('')
    const [sorted,setSorted] = useState(null)
useFocusEffect(
    React.useCallback(
        ()=>{
            async function fetchData(){
               setReviews( await GetReviews())
            }
            fetchData()
        },[query]
    )
)

return (
    <ScrollView>
        <View className="flex flex-row justify-around">
        <Text>Vous avez {reviews ? reviews.totalReviews : 0} avis</Text>
        <TextInput onChangeText={value=>setQuery(value)} className="border-solid border-2 rounded-lg pl-2" placeholder="chercher un avis"></TextInput>
        </View>
        <DataTable>
            <DataTable.Header>
                <DataTable.Title style={{justifyContent : "center"}} onPress={reviews ? async()=>{ if( reviews.shopReviews[0].sort >  reviews.shopReviews[reviews.shopReviews.length - 1].sort ){ setSorted("a.sort - b.sort")}else{setSorted("b.sort - a.sort")}} : null}>#</DataTable.Title>
                <DataTable.Title style={{justifyContent : "center"}} onPress={reviews ? async()=>{ if( reviews.shopReviews[0].customerName.localeCompare(reviews.shopReviews[reviews.shopReviews.length - 1].customerName) == 1 ){ setSorted("a.customerName.localeCompare(b.customerName)")}else{setSorted("b.customerName.localeCompare(a.customerName)")}} : null}>Nom</DataTable.Title>
                <DataTable.Title style={{justifyContent : "center"}} onPress={reviews ? async()=>{ if( reviews.shopReviews[0].rating >  reviews.shopReviews[reviews.shopReviews.length - 1].rating ){ setSorted("a.rating - b.rating")}else{setSorted("b.rating - a.rating")}} : null}>Note</DataTable.Title>
                <DataTable.Title style={{justifyContent : "center"}} onPress={reviews ? async()=>{ if( reviews.shopReviews[0].review.localeCompare(reviews.shopReviews[reviews.shopReviews.length - 1].review) == 1 ){ setSorted("a.review.localeCompare(b.review)")}else{setSorted("b.review.localeCompare(a.review)")}} : null}>Avis</DataTable.Title>
                <DataTable.Title style={{justifyContent : "center"}} onPress={reviews ? async()=>{ if( reviews.shopReviews[0].reviewDate.localeCompare(reviews.shopReviews[reviews.shopReviews.length - 1].reviewDate) == 1 ){ setSorted("a.reviewDate.localeCompare(b.reviewDate)")}else{setSorted("b.reviewDate.localeCompare(a.reviewDate)")}} : null}>Date</DataTable.Title>
            </DataTable.Header>
            {reviews == null  ?
            <DataTable.Row>
                <DataTable.Cell style={{flex : 5,justifyContent : "center"}}>Pas de données disponibles</DataTable.Cell>
            </DataTable.Row>
             :
             reviews.shopReviews ?
             sorted == null ?
             reviews.shopReviews.map((element,index)=> 
               
           <TouchableOpacity key={index} onPress={()=>{setDetails(true);setModalData(element)}}>
            <Modal   visible={details}>
                <View >
                <Text className="text-center m-2">Avis</Text>
                <Text className="text-center m-2">{modalData.customerName}</Text>
                <Text className="text-center m-2">{modalData.rating}/5</Text>
                <Text className="text-center m-2">{modalData.review}</Text>
                <View className="m-2">
                <Button title="Fermer" onPress={()=>setDetails(false)}></Button>
                </View>
                </View>
            </Modal>
            <View   style={{margin : 2,display : element.review.toLowerCase().includes(query.toLowerCase()) || (element.rating.toString() + "/5").includes(query.toLowerCase()) || element.customerName.toLowerCase().includes(query.toLowerCase()) || (index+1).toString().toLowerCase().includes(query.toLowerCase()) || (element.reviewDate.substring(8,10) + '/' +   element.reviewDate.substring(5,7) + '/' + element.reviewDate.substring(0,4)  + element.reviewDate.substring(11,16)).toString().toLowerCase().includes(query.toLowerCase()) ? "flex" : "none",flexDirection : "row"}}>
                         <View style={{display : "flex",flexDirection : "row",flex : 1,justifyContent : "center" }} ><Text style={{flexShrink : 1}}>{element.sort}</Text></View>

             <View style={{display : "flex",flexDirection : "row",flex : 1,justifyContent : "center" }} ><Text style={{flexShrink : 1}}>{element.customerName}</Text></View>
             <View style={{display : "flex",flexDirection : "row",flex : 1,justifyContent : "center" }} ><Text style={{flexShrink : 1}}>{element.rating}/5</Text></View>
             <View style={{display : "flex",flexDirection : "row",flex : 1,justifyContent : "center" }} ><Text style={{flexShrink : 1}}>{element.review}</Text></View>
             <View style={{display : "flex",flexDirection : "row",flex : 1 ,justifyContent : "center"}} ><Text style={{flexShrink : 1}}>{element.reviewDate.substring(8,10) }/{element.reviewDate.substring(5,7)}/{element.reviewDate.substring(0,4)} {element.reviewDate.substring(11,16)}</Text></View>
  
         </View>
         </TouchableOpacity>
             )
             :
             reviews.shopReviews.sort((a,b)=> eval(sorted)).map((element,index)=> 
               
             <TouchableOpacity key={index} onPress={()=>{setDetails(true);setModalData(element)}}>
              <Modal   visible={details}>
                  <View >
                  <Text className="text-center m-2">Avis</Text>
                  <Text className="text-center m-2">{modalData.customerName}</Text>
                  <Text className="text-center m-2">{modalData.rating}/5</Text>
                  <Text className="text-center m-2">{modalData.review}</Text>
                  <View className="m-2">
                  <Button title="Fermer" onPress={()=>setDetails(false)}></Button>
                  </View>
                  </View>
              </Modal>
              <View   style={{margin : 2,display : element.review.toLowerCase().includes(query.toLowerCase()) || (element.rating.toString() + "/5").includes(query.toLowerCase()) || element.customerName.toLowerCase().includes(query.toLowerCase()) || (index+1).toString().toLowerCase().includes(query.toLowerCase()) || (element.reviewDate.substring(8,10) + '/' +   element.reviewDate.substring(5,7) + '/' + element.reviewDate.substring(0,4)  + element.reviewDate.substring(11,16)).toString().toLowerCase().includes(query.toLowerCase()) ? "flex" : "none",flexDirection : "row"}}>
                           <View style={{display : "flex",flexDirection : "row",flex : 1,justifyContent : "center" }} ><Text style={{flexShrink : 1}}>{element.sort}</Text></View>
  
               <View style={{display : "flex",flexDirection : "row",flex : 1,justifyContent : "center" }} ><Text style={{flexShrink : 1}}>{element.customerName}</Text></View>
               <View style={{display : "flex",flexDirection : "row",flex : 1,justifyContent : "center" }} ><Text style={{flexShrink : 1}}>{element.rating}/5</Text></View>
               <View style={{display : "flex",flexDirection : "row",flex : 1,justifyContent : "center" }} ><Text style={{flexShrink : 1}}>{element.review}</Text></View>
               <View style={{display : "flex",flexDirection : "row",flex : 1 ,justifyContent : "center"}} ><Text style={{flexShrink : 1}}>{element.reviewDate.substring(8,10) }/{element.reviewDate.substring(5,7)}/{element.reviewDate.substring(0,4)} {element.reviewDate.substring(11,16)}</Text></View>
               
           </View>
           </TouchableOpacity>
               )
   : null }

        </DataTable>
    </ScrollView>
)
}


export default ShopRatings;