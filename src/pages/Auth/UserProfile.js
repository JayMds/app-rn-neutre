import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, Image } from "react-native"
import * as ImagePicker from "expo-image-picker"
import CategoriesDB from "../../dataAccesLayer/repositoryPierreBeney/CategoriesDB";
import UserProfileDB from "../../dataAccesLayer/repositoryPierreBeney/UserProfileDB";
import EditUserProfileDB from "../../dataAccesLayer/repositoryPierreBeney/EditUserProfileDB";
import UploadShopIconDB from "../../dataAccesLayer/repositoryPierreBeney/UploadShopIconDB";
import {manipulateAsync }   from 'expo-image-manipulator'
import strings from "../../utils/res/strings";
import MapView, { Marker } from "react-native-maps";



function UserProfile (){
    const [title,setTitle] = useState('')
    const navigation = useNavigation();
    const [userProfile,setUserProfile] = useState('')
      useFocusEffect(
        
         React.useCallback(() =>{

                fetchUserProfile()

 },[])
      )

      const fetchUserProfile = async() =>{
            const   userProfile  = await UserProfileDB()
            const categories = await CategoriesDB()
            
           setUserProfile(userProfile)
           if(await userProfile.shopCategoryId !== 0){
            categories.map((element)=>{
                if(element.shopCategoryId === userProfile.shopCategoryId){
                    setCategories(element.name)
                }
            })
           }
           else{
            setCategories(categories)
           }
           setImage(null)
           setCategoryID(userProfile.shopCategoryId)
           const date = Date.parse(userProfile.dateOfBirth)
           let newDate = new Date(date)
           let month;
           let day;
           if(newDate.getUTCDate() < 10 ){
            day = '0' + newDate.getUTCDate()
           }
           else{
            day = newDate.getUTCDate()
           }
           if(newDate.getUTCMonth()+1 < 10 ){
            month = '0' + (newDate.getUTCMonth()+1)
           }
           else{
            month = newDate.getUTCMonth()+1
           }
           newDate = day + "/" + month   + "/" + newDate.getUTCFullYear()
           setDate(newDate)
           setImage(userProfile.shopIcon)
           setLatitude(userProfile.latitude)
           setLongitude(userProfile.longitude)
           reset({
            shopName : userProfile.shopName,
            shopLegalName : userProfile.shopLegalName,
            headquarterAddress : userProfile.headquarterAddress,
            description : userProfile.description,
            shopTags : userProfile.shopTags,
            email : userProfile.email,
            ownerFirstName : userProfile.ownerFirstName,
            ownerLastName : userProfile.ownerLastName,
            telephoneNumber : userProfile.telephoneNumber,
            mobileNumber : userProfile.mobileNumber,
            address : userProfile.address,
            suiteAddress : userProfile.suiteAddress,
            postalCode : userProfile.postalCode,
            city : userProfile.city,
            longitude : userProfile.longitude.toString(),
            latitude : userProfile.latitude.toString(),
            tradeLicenseNo : userProfile.tradeLicenseNo,
            vatNumber : userProfile.vatNumber,
            shopIcon : userProfile.shopIcon,
            categoriesFetch : categories,
            shopRecordID : userProfile.shopRecordID,
            dateOfBirth : newDate,
            ownerNationality : userProfile.ownerNationality,
            ownerCountry : userProfile.ownerCountry
           })
    }
     const{control, handleSubmit, formState : {errors}, reset,register,setValue,getValues,watch} = useForm(
        {
          
            defaultValues : {
                shopName :  '',
                shopLegalName : '',
                headquarterAddress : '',
                description : '',
                shopTags : '',
                email : '',
                ownerFirstName : '',
                ownerLastName : '',
                telephoneNumber : '',
                mobileNumber : '',
                address : '',
                suiteAddress : '',
                postalCode : '',
                city : '',
                longitude : '',
                latitude : '',
                tradeLicenseNo : '',
                vatNumber : '',
                shopIcon : '',
                categoriesFetch : '',
                shopRecordID : '',
                dateOfBirth : '',
                ownerNationality : '',
                ownerCountry : ''
            }
            


        }
     )
     const onSubmit = async data =>{
        //check si l'image est importée du téléphone
        if(image != null){
            if(image.startsWith("file:///data/")){
               const url = await UploadShopIconDB(image,userProfile.shopId)
                    if(await EditUserProfileDB(data,url,categoryID,userProfile.shopRecordID,date,latitude,longitude,userProfile)){
                        navigation.navigate(strings.tabs.orders)
                    }
                   
                
               
               
            }
            else{
                if(await EditUserProfileDB(data,image,categoryID,userProfile.shopRecordID,date,latitude,longitude,userProfile)){
                    navigation.navigate(strings.tabs.orders)
                }
                
            }
        }else{
            editUser(data)
        }
        
            
        
        
        
    }
    const editUser = async data =>{
       if( await EditUserProfileDB(data,image,categoryID,userProfile.shopRecordID,date,latitude,longitude,userProfile)){
        navigation.navigate(strings.tabs.orders)
       }
    }

    //state modal catégories
    const [modalVisible,setModalVisible] = useState(false)
    //state catégories
    const [categories,setCategories] = useState('Catégories')
    //state image picker
    const [image,setImage] = useState(null)
    //category ID
    const [categoryID,setCategoryID] = useState(null)
    //date de naissance
    const [date,setDate] = useState(null)
    //latitude et longitude pour la google maps
    const [latitude,setLatitude] = useState(1)
    const [longitude,setLongitude] = useState(1)
    function modal(){
        setModalVisible(!modalVisible)
        
    }
    function chooseCategory(test){
        
        setCategories(test.name)
        setCategoryID(test.shopCategoryId)
        setModalVisible(!modalVisible)
        
    }
    

    const pickImage = async() =>{
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes : ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect : [4,3], 
            quality: 1,
        })
        console.log(result)

        if(!result.cancelled){
            const manipResult = await manipulateAsync(
                result.uri,
                [
                { 
                    resize : {
                        width : 992,
                        height : 556
                    }
                },
                
                

                
                
                ]
            )
            setImage(manipResult.uri)
        }
    }
    return (
    <SafeAreaView className="flex h-full w-full   bg-white">
    <ScrollView>
        <Controller control={control} 
        render = {({field : {onChange,OnBlur,value}})=>(
            <TextInput  editable={false} placeholder="shopRecordID" value={value} style={{display:"none"}} />
    )}
    name="shopRecordID" />
        <Controller control={control} 
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput   value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Nom de la boutique" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="shopName"/>
             <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Raison sociale" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="shopLegalName"/>
             <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Adresse du siège" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="headquarterAddress"/>
             <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput editable={false}  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Description" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )} 
        name="description"/>

        <View className="m-2">
        <Button onPress={pickImage} title="Importer une photo"></Button>
        </View>
        <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
        <Image className="self-center"  source={image ? {uri : image} : value ?{uri : value} : null}  style={{height : 200, width : 200}}/>  
        )}
        name="shopIcon"/>
       
        <View className="m-2">
        <Button title={ typeof categories !== 'string' ? "catégories" : categories}  onPress={modal}></Button>
         <Modal  visible={modalVisible} onRequestClose={modal}>
         <ScrollView>
            <TouchableOpacity >
               <Controller control={control}  
               render = {({field : {onChange,onBlur,value}}) =>( 
                
                    value.map((element) =>{ 
                        return (<Text className="text-center text-xl m-2" key={element.shopCategoryId} onPress={() => {chooseCategory(element)}} >{element.name}</Text>)
                    })
                 
                 )}
                 name="categoriesFetch"/>
                </TouchableOpacity>
                </ScrollView>
                </Modal> 
                </View>
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Tags de la boutique" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="shopTags"/>
                     <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput editable={false}  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Adresse mail" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="email"/>
                <View className="flex flex-row">
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput editable={false}  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Prénom du propriétaire" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="ownerFirstName"/>
                     <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput editable={false}  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Nom de famille" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="ownerLastName"/>

                </View>
                <View className="flex flex-row">
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Téléphone fixe" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="telephoneNumber"/>
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Téléphone mobile" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="mobileNumber"/>

                </View>
                <View className="m-2">
                <Controller control={control}
                        render = {({field : {onChange, onBlur , value}}) =>(
                            <Button  title={date ? date : "chargement"} />
                        )}
                        name="dateOfBirth"/>
                        </View>
                                    <View className="flex flex-row">
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput editable={false} value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Nationalité du propriétaire" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="ownerNationality"/>
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput editable={false}  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Pays de résidence" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="ownerCountry"/>

                </View>
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Adresse" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="address"/>
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Suite adresse(optionnel)" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="suiteAddress"/>
                <View className="flex flex-row">
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Code postal" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="postalCode"/>
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Ville" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="city"/>

                </View>
                <View className="flex flex-row">
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput editable={false} value={longitude.toString()} onBlur={onBlur}  placeholder="Longitude" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="longitude"/>
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput editable={false}  value={latitude.toString()}  onBlur={onBlur}  placeholder="Latitude" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="latitude"/>

                </View>
                <MapView onPoiClick={(e)=>{setLatitude(e.nativeEvent.coordinate.latitude);setLongitude(e.nativeEvent.coordinate.longitude);setTitle(e.nativeEvent.name)}} className="self-center"  region={{latitude : latitude,longitude : longitude,latitudeDelta : 0.000536,longitudeDelta : 0.000994}} style={{width : 200, height : 200}}>
                    <Marker title={title}  onDragEnd={(e)=>{setLatitude(e.nativeEvent.coordinate.latitude);setLongitude(e.nativeEvent.coordinate.longitude)}} draggable={true}  coordinate={{latitude : latitude, longitude : longitude}}></Marker>
                    </MapView>
                <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput editable={false}  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Siret" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="tradeLicenseNo"/>
                               <Controller control={control}
        render = {({field : {onChange, onBlur , value}}) =>(
            <TextInput editable={false}  value={value} onChangeText={onChange} onBlur={onBlur}  placeholder="Numéro de TVA" className="border-solid border-2 m-2 pl-2" ></TextInput>
        )}
        name="vatNumber"/>
                <View className="flex flex-row m-2 justify-evenly">
                <Button title="Enregistrer" onPress={handleSubmit(onSubmit)}></Button>
                <Button title="Annuler" onPress={()=>{navigation.navigate(strings.tabs.orders)}}></Button>
                </View>
    </ScrollView>
    </SafeAreaView>
    )
}

export default UserProfile;