import AsyncStorage from "@react-native-async-storage/async-storage";
import {  useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {  Button, SafeAreaView, ScrollView, Text, View, ToastAndroid } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Checkbox } from "react-native-paper";
import EditOpenHours from "../../dataAccesLayer/repositoryPierreBeney/EditOpenHours";
import GetOpenHoursDB from "../../dataAccesLayer/repositoryPierreBeney/GetOpenHoursDB";
import Days from "../../components/OpenHours/Days";
import strings from "../../utils/res/strings";



const OpenHours = () =>{
    const navigation = useNavigation()
    //state pour enregistrer les heures en BDD
    const [tabSetHours,setTabSetHours] = useState([])
    let tab = []
    let obj = new Object()
    const onSubmit = async () => {
        const tabToSubmit = []
        for(let i = 0;i < 7;i++){
            const obj = new Object()
            const getDayMorning = await AsyncStorage.getItem(i + 'matin' )
            const getDayEndMorning = await AsyncStorage.getItem(i + 'matinFin' )
            const getDayAfternoon = await AsyncStorage.getItem(i + 'après-midi' )
            const getDayEndAfternoon = await AsyncStorage.getItem(i + 'après-midiFin' )
            getDayMorning = JSON.parse(getDayMorning)
            getDayEndMorning = JSON.parse(getDayEndMorning)
            getDayAfternoon = JSON.parse(getDayAfternoon)
            getDayEndAfternoon = JSON.parse(getDayEndAfternoon)
            obj['startTimeAM'] = getDayMorning.startTimeAM
            obj['endTimeAM'] = getDayEndMorning.endTimeAM
            obj['startTimePM'] = getDayAfternoon.startTimePM
            obj['endTimePM'] = getDayEndAfternoon.endTimePM
            if(getDayEndAfternoon.nowOpen == false && getDayEndMorning == false){
                obj['nowOpen'] = false
            }
            else{
                obj['nowOpen'] = true
            }
            
            if (livraison == true){
                obj['deliveryMethod'] = 2
            }else{
                obj['deliveryMethod'] = 1
            }
            obj['dayOfWeek'] = getDayEndAfternoon.dayOfWeek
            
            obj['shopId'] = await AsyncStorage.getItem('ShopID')
            obj['shopOpeningHourID'] = getDayEndAfternoon.shopOpeningHourID
            setTabSetHours(oldArray =>[...oldArray,obj])
            tabToSubmit.push(obj)
        }
        if(await EditOpenHours(tabToSubmit) ){
            ToastAndroid.show("Les horaires ont étés modifiés",ToastAndroid.SHORT)
            navigation.navigate(strings.tabs.orders)
        }else{
            ToastAndroid.show("Erreur veuillez réessayer!",ToastAndroid.SHORT)
        }

    };
    const { control,register, handleSubmit, watch, formState: { errors } } = useForm();
   //state pour la checkbox des vacances
    const [isChecked,setIsChecked] = useState('unchecked')
    //state pour choisir livraison ou click and collect
    const [livraison,setLivraison] = useState(true)
    const [clickAndCollect, setClickAndCollect] = useState(false)
    //state pour la sélection possible ou non des horaires (vacances ou travail)
    const [isselectedHolidays,setIsSelectedHolidays] = useState('auto')
    //state pour griser ou non les heures 
    
    const [isGray, setIsGray] = useState()
    const Checked =() =>{
        if(isChecked == 'unchecked'){
        setIsChecked('checked')
        setIsSelectedHolidays('none')
        setIsGray('gray')
    }
        else{setIsChecked('unchecked');setIsSelectedHolidays('auto');setIsGray('#2196F3')}
    }
    return (
        
        <SafeAreaView className="flex h-full w-full   bg-white">
            <ScrollView horizontal={true} >
                <View className="flex">
               
                <View  className="flex flex-row ">
                    <TouchableOpacity>
                <Text  style={livraison ?{borderBottomWidth : 2} : {}} onPress={()=>{setLivraison(true);setClickAndCollect(false);setTabSetHours([])}} className="mr-5 mb-10">Horaires d'ouvertures en livraison</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                <Text style={clickAndCollect ?{ borderBottomWidth : 2} : {}} onPress={()=>{setLivraison(false);setClickAndCollect(true);setTabSetHours([])}}>Horaires d'ouvertures en Click&Collect</Text>
                </TouchableOpacity>
                </View>
                <View className="flex flex-row justify-around">
                <Text className="font-bold mb-10 text-center ">Matin</Text>
                <Text className="font-bold mb-10 text-center ">Après-midi</Text>
                </View>
                <View  pointerEvents={isselectedHolidays}>
                    
                    <View className="flex flex-row  items-center mb-5">
                    <Text >Lundi</Text>
                    <Days  livraison={livraison} className="justify-self-center"  day='1' color = {isGray}></Days>
                    </View>
                    <View className="flex flex-row items-center mb-5">
                    <Text>Mardi</Text>
                    <Days  livraison={livraison}  day='2' color = {isGray}></Days>
                    </View>
                    <View className="flex flex-row items-center mb-5">
                    <Text>Mercredi</Text>
                    <Days livraison={livraison}  day='3' color = {isGray}></Days>
                    </View>
                    <View className="flex flex-row items-center mb-5">
                    <Text>Jeudi</Text>
                    <Days  livraison={livraison}  day='4' color = {isGray}></Days>
                    </View>
                    <View className="flex flex-row items-center mb-5">
                    <Text>Vendredi</Text>
                    <Days livraison={livraison}  day='5' color = {isGray}></Days>
                    </View>
                    <View className="flex flex-row items-center mb-5">
                    <Text>Samedi</Text>
                    <Days livraison={livraison} day='6' color = {isGray}></Days>
                    </View>
                    <View className="flex flex-row items-center mb-5">
                    <Text>Dimanche</Text>
                    <Days livraison={livraison}  day='0' color = {isGray}></Days>
                    </View>
                    <Button title="Enregistrer" onPress={handleSubmit(onSubmit)}></Button>
                    
                    </View>
                    </View>
                   
                    
            </ScrollView>
        </SafeAreaView>
    )
}

export default OpenHours;