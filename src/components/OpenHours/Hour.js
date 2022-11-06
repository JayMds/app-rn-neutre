import RNDateTimePicker, { DateTimePickerAndroid, RCTDateTimePickerNative } from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { nothing } from "immer";
import React, { useEffect, useState } from "react";
import { Button, Modal, Text, View } from "react-native";
import GetOpenHoursDB from "../../dataAccesLayer/repositoryPierreBeney/GetOpenHoursDB";
import DateTimePickerModal  from "react-native-modal-datetime-picker"
import { Checkbox } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";




 const Hour = (props) =>{

    // variable pour remettre les heures si réouverture
    let backOpenHours
    switch(props.subday){
        case 'matin' : backOpenHours = "07:00";break;
        case 'matinFin' : backOpenHours = "16:00";break;
        case 'après-midi' : backOpenHours = "16:00";break;
        case 'après-midiFin' : backOpenHours = "23:00";break;
    }
        //state qui contient les heures fetched en BDD
        const [data,setData]  = useState('chargement') 
    useFocusEffect(
        
        React.useCallback(() =>{
         

                
                  FormatHours()
                  let dateToSet
                  let checkedAtStart
                  let obj = new Object()
                  async function load(){
                     dateToSet = await GetOpenHoursDB(await props.livraison)
                     dateToSet.map((element)=>{
                        if(element.dayOfWeek == props.day){  
                            const dayID = element.shopOpeningHourID
                            switch(props.subday){
                                case 'matin' :  setDate(element.startTimeAM.slice(0,element.startTimeAM.length - 3));dateToSet = element.startTimeAM.slice(0,element.startTimeAM.length - 3);checkedAtStart = element.nowOpen;break;
                                case 'matinFin' : setDate (element.endTimeAM.slice(0,element.endTimeAM.length - 3));dateToSet= element.endTimeAM.slice(0,element.endTimeAM.length - 3);checkedAtStart = element.nowOpen;break;
                                case 'après-midi' : setDate(element.startTimePM.slice(0,element.startTimePM.length - 3));dateToSet = element.startTimePM.slice(0,element.startTimePM.length - 3);checkedAtStart = element.nowOpen;break;
                                case 'après-midiFin' : setDate(element.endTimePM.slice(0,element.endTimePM.length - 3));dateToSet = element.endTimePM.slice(0,element.endTimePM.length - 3);checkedAtStart = element.nowOpen;break;
                                 
                            }
                            
                   
                        
                                switch(props.subday){
                                    case 'matin':  obj['startTimeAM'] = dateToSet;break;
                                    case 'matinFin':  obj['endTimeAM'] = dateToSet;break;
                                    case 'après-midi':  obj['startTimePM'] = dateToSet;break;
                                    case 'après-midiFin':  obj['endTimePM'] = dateToSet;break;
                                }
                                
                                obj['dayOfWeek'] = Number.parseInt(props.day)
                                if(checkedAtStart == true){
                                    obj['nowOpen'] = checkedAtStart
                                }
                                else{
                                    obj['nowOpen'] = !checkedAtStart
                                }
                                obj['shopOpeningHourID'] = dayID
                                AsyncStorage.setItem(props.day + props.subday,JSON.stringify(obj))
                                
                            }   
                            
                        }
                     

                     )
                  }
                  
                    load()
           
                  
                  
                 
   
        
            
          
          
       

       
},[typeof data,props.livraison])
     )

 //state pour définir l'affichage des heures
 const [date,setDate] = useState('load')
 //state pour ouvrir la modal des heures 
 const [timePicker,setTimePicker] = useState(false)
 //pour ouvrir la modal des heures
 const onChange = async(event,selectedDate)=>{
    const hours  = event.getHours()
    const minutes  = event.getMinutes()
  const currentDate = (hours < 10 ? '0' + hours : hours) +  ':' +  (minutes < 10 ? '0' + minutes : minutes);
  setDate(currentDate);
  setTimePicker(false)
  let fetchedDay = await AsyncStorage.getItem(props.day + props.subday)
  fetchedDay = JSON.parse(fetchedDay)
  let obj = fetchedDay
  switch(props.subday){
    case 'matin':  obj['startTimeAM'] = currentDate;break;
    case 'matinFin':  obj['endTimeAM'] = currentDate;break;
    case 'après-midi':  obj['startTimePM'] = currentDate;break;
    case 'après-midiFin':  obj['endTimePM'] = currentDate;break;
}


AsyncStorage.setItem(props.day + props.subday, JSON.stringify(obj))

 }
 const FormatHours = async() =>{
     const deliveryType =  await GetOpenHoursDB(await props.livraison)

     if(typeof deliveryType != 'string'){
                   deliveryType.map(
              (element)=>{
                  if(element.dayOfWeek == props.day){
                    let retour
                      switch(props.subday){
                          case 'matin' : setDate(element.startTimeAM.slice(0,element.startTimeAM.length - 3));retour = element.startTimeAM.slice(0,element.startTimeAM.length - 3);break;
                          case 'matinFin' : setDate (element.endTimeAM.slice(0,element.endTimeAM.length - 3));retour = element.endTimeAM.slice(0,element.endTimeAM.length - 3);break;
                          case 'après-midi' : setDate(element.startTimePM.slice(0,element.startTimePM.length - 3));retour = element.startTimePM.slice(0,element.startTimePM.length - 3);break;
                          case 'après-midiFin' : setDate(element.endTimePM.slice(0,element.endTimePM.length - 3));retour = element.endTimePM.slice(0,element.endTimePM.length - 3);break;
                          
                      }
                      return retour
                  }
              }
          )
     }
   
 }

 //Dates de base
 function StartingDates (){
   if (props.subday == 'matin' || props.subday == 'après-midi') {

     }
     else {
        return <Text className="self-center mr-2">à</Text>
     }
}
 


    return (
        <View className = "flex flex-row mr-2">
            {StartingDates()}
        
        <Button disabled={props.morning == 'unchecked' || props.afternoon == 'unchecked' ? true : false}  title={props.morning == 'unchecked' || props.afternoon == 'unchecked' ? 'fermé' : date.toString() == "00:00" ? backOpenHours : date.toString() } onPress={()=>{setTimePicker(true)}} />
        {props.subday == 'après-midiFin' || props.subday == 'matinFin' ?
        <View className="flex flex-row">
       </View>
      : null }
      
        
         <DateTimePickerModal  minuteInterval={30} date={new Date("2022-09-13T" + date + "+02:00" )}  onConfirm={onChange}  onCancel={()=>{setTimePicker(false)}} mode="time" isVisible={timePicker} display="default">
        </DateTimePickerModal>  

        
        
       
        
        
        
         
        </View>
    )
 }

 export default Hour;