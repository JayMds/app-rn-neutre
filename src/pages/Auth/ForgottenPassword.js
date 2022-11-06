import React, { useContext, useState } from "react";
import {View,Text, TextInput,Button} from "react-native";
import ForgotPassword from "../../dataAccesLayer/repositoryPierreBeney/ForgotPassword";
import {  useNavigation } from "@react-navigation/native";
import strings from "../../utils/res/strings";
import { PasswordContext } from "../../../global";


const ForgottenPassword = () =>{
    const navigation = useNavigation()
    const [email,setEmail] = useState('')
    const [changePassword,setChangePassword] = useContext(PasswordContext)
    const ChangePassword = async() =>{
        if(await ForgotPassword(email)){
            setChangePassword(true)
            navigation.navigate(strings.tabs.login)

        }
    }
return (
    <View>
        <Text>Entrez votre adresse E-mail.Un nouveau mot de passe vous sera envoyé sur celle-ci.</Text>
        <TextInput onChangeText={value =>setEmail(value)} placeholder="adresse mail" className="m-6 border-solid border-2 rounded-lg pl-2 "></TextInput>
        <Button onPress={ChangePassword} title="Changer mon mot de passe"></Button>
    </View>
)

}

export default ForgottenPassword;