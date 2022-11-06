import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { View,Text } from "react-native";
import { Checkbox } from "react-native-paper";
import GetOpenHoursDB from "../../dataAccesLayer/repositoryPierreBeney/GetOpenHoursDB";
import Hour from "./Hour";


const Days = (props) =>{

    useFocusEffect(
        React.useCallback(
            ()=>{
                async function onLoad(){
                    let obj = new Object()
                    let dateToSet = await GetOpenHoursDB(await props.livraison)
                    dateToSet.map((element)=>{
                        if(element.dayOfWeek == props.day){  
                           
                            
                                const  dateToSet1 = element.startTimeAM.slice(0,element.startTimeAM.length - 3);
                               const  dateToSet2= element.endTimeAM.slice(0,element.endTimeAM.length - 3);
                               const  dateToSet3 = element.startTimePM.slice(0,element.startTimePM.length - 3);
                               const dateToSet4 = element.endTimePM.slice(0,element.endTimePM.length - 3);
                               obj['startTimeAM'] = dateToSet1;
                               obj['endTimeAM'] = dateToSet2;
                              obj['startTimePM'] = dateToSet3;
                             obj['endTimePM'] = dateToSet4;
                            }
                            
                   
                        
                                
                              
                                
                                
                               
                                
                                
                            }   
                            
                        )
                    
                    let morningStart = obj['startTimeAM']
                    let morningEnd = obj['endTimeAM']
                    let afternoonStart = obj['startTimePM']
                    let afternoonEnd = obj['endTimePM']
                    if(morningStart == "00:00" && morningEnd== "00:00"){
                        setCheckedMorning( 'unchecked')
                    }
                    else{
                        setCheckedMorning('checked')
                    }
                    if(afternoonStart == '00:00' && afternoonEnd == '00:00'){
                        setCheckedAfternoon('unchecked')
                    }
                    else{
                        setCheckedAfternoon('checked') 
                    }
                }
                onLoad()
                
            }
        ,[props.livraison]) 
    )
    const tab =['ml-3','ml-10','ml-9','ml-5','ml-10','ml-5','ml-7']
    //state test pour render
    const [onChange,setOnChange] = useState(false)
    //state pour gérer la fermeture du matin
    const [checkedMorning,setCheckedMorning] = useState('checked' )
        //state pour gérer la fermeture de l'après-midi
        const [checkedAfternoon,setCheckedAfternoon] = useState('checked')

    return (
        <View className="flex flex-row ">
        <View className={tab[props.day]}>
         <Hour morning={checkedMorning}  livraison={props.livraison}  day={props.day} color={props.color}  subday = 'matin'></Hour> 
         </View>
         <View className="mr-10 flex flex-row">
        <Hour morning={checkedMorning}  livraison={props.livraison}  day={props.day} color={props.color} subday = 'matinFin'></Hour>
        <Checkbox onPress={async()=>{
            if(checkedMorning == 'checked'){
                setCheckedMorning('unchecked')
                let morningStart = await AsyncStorage.getItem(props.day + 'matin')
                let morningEnd = await AsyncStorage.getItem(props.day + 'matinFin')
                morningStart = JSON.parse(morningStart)
                morningEnd = JSON.parse(morningEnd)
                morningStart['startTimeAM'] = "00:00"
                morningEnd['endTimeAM'] = "00:00"
                morningEnd['nowOpen'] = false
                AsyncStorage.setItem(props.day + 'matin',JSON.stringify(morningStart))
                AsyncStorage.setItem(props.day + 'matinFin',JSON.stringify(morningEnd))
            }
                
                else{
                    setCheckedMorning('checked')
                    let morningStart = await AsyncStorage.getItem(props.day + 'matin')
                    let morningEnd = await AsyncStorage.getItem(props.day + 'matinFin')
                    morningStart = JSON.parse(morningStart)
                    morningEnd = JSON.parse(morningEnd)
                    morningStart['startTimeAM'] = "07:00"
                    morningEnd['endTimeAM'] = "16:00"
                    morningEnd['nowOpen'] = true
                    AsyncStorage.setItem(props.day + 'matin',JSON.stringify(morningStart))
                AsyncStorage.setItem(props.day + 'matinFin',JSON.stringify(morningEnd))
                }
                    }} status={checkedMorning}>

                    </Checkbox>
                    <Text className="self-center">Ouvert</Text>
        </View>
        
        <View>
         <Hour afternoon={checkedAfternoon}  livraison={props.livraison} day={props.day} color={props.color} subday = 'après-midi'></Hour> 
         </View>
         <View className="flex flex-row">
         <Hour afternoon={checkedAfternoon}  livraison={props.livraison} day={props.day} color={props.color} subday = 'après-midiFin'></Hour> 
         <Checkbox onPress={async()=>{
            if(checkedAfternoon == 'checked'){
                setCheckedAfternoon('unchecked')
                let afternoonStart = await AsyncStorage.getItem(props.day + 'après-midi')
                let afternoonEnd = await AsyncStorage.getItem(props.day + 'après-midiFin')
                afternoonStart = JSON.parse(afternoonStart)
                afternoonEnd = JSON.parse(afternoonEnd)
                afternoonStart['startTimePM'] = "00:00"
                afternoonEnd['endTimePM'] = "00:00"
                afternoonEnd['nowOpen'] = false
                AsyncStorage.setItem(props.day + 'après-midi',JSON.stringify(afternoonStart))
                AsyncStorage.setItem(props.day + 'après-midiFin',JSON.stringify(afternoonEnd))
            }
                else{
                    setCheckedAfternoon('checked')
                    let afternoonStart = await AsyncStorage.getItem(props.day + 'après-midi')
                    let afternoonEnd = await AsyncStorage.getItem(props.day + 'après-midiFin')
                    afternoonStart = JSON.parse(afternoonStart)
                    afternoonEnd = JSON.parse(afternoonEnd)
                    afternoonStart['startTimePM'] = "16:00"
                    afternoonEnd['endTimePM'] = "23:00"
                    afternoonEnd['nowOpen'] = true
                    AsyncStorage.setItem(props.day + 'après-midi',JSON.stringify(afternoonStart))
                    AsyncStorage.setItem(props.day + 'après-midiFin',JSON.stringify(afternoonEnd))
            }
                }} status={checkedAfternoon}>

                </Checkbox>
                <Text className="self-center">Ouvert</Text>
         </View>
         </View>
    )
}

export default Days;