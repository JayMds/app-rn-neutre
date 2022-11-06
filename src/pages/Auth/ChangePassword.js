import React, { useContext, useState } from "react";
import {View,TextInput,Button} from "react-native"
import ChangePassword from "../../dataAccesLayer/repositoryPierreBeney/ChangePassword";
import {  useNavigation } from "@react-navigation/native";

import { PasswordContext } from "../../../global";

const ChangePasswordPage = () =>{
    const [changePassword,setChangePassword] = useContext(PasswordContext)

    const [currentPassword,setCurrentPassword] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const passwordChange = async() =>{
        if(await ChangePassword(currentPassword,newPassword,confirmPassword)){
            setChangePassword(false)
        }
        
    }
return (
    <View>
       <TextInput secureTextEntry={true} onChangeText={value => setCurrentPassword(value)} className= "border-solid border-2 rounded-lg pl-2 m-6" placeholder="Mot de passe actuel"></TextInput>
       <TextInput secureTextEntry={true} onChangeText={value => setNewPassword(value)} className= "border-solid border-2 rounded-lg pl-2 m-6" placeholder="Nouveau mot de passe"></TextInput>
       <TextInput secureTextEntry={true} onChangeText={value => setConfirmPassword(value)} className= "border-solid border-2 rounded-lg pl-2 m-6" placeholder="Confirmer le nouveau mot de passe"></TextInput>
        <Button onPress={passwordChange} title="Valider"></Button>
    </View>
)
}

export default ChangePasswordPage;