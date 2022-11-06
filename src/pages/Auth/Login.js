import React, { useContext, useState } from 'react';
import { Button, Image, SafeAreaView,  Switch,  Text,  TextInput, View , Linking} from 'react-native';
import strings from '../../utils/res/strings';
import { AuthContext } from '../../../global';
import testDB from '../../dataAccesLayer/repositoryPierreBeney/testDB';
import { ScrollView } from 'react-native-gesture-handler';
import { Checkbox } from 'react-native-paper';
import {  useNavigation } from "@react-navigation/native";
import {useDispatch} from "react-redux";
import {getSessionId} from "../../utils/tools/saveSessionId";


const Login = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [setIsLogged] = useContext(AuthContext)
    // Remember me ?
    
    async function rememberMe(){ if(await getSessionId('Session') != null){
        setIsLogged(true)
    }
}
rememberMe()
    function handleChange(newText){
          setIdentifiant(newText)
    }
    function handlePasswordChange(newText){
        setMotDePasse(newText)
    }
    // State pour changer la valeur du switch Rememberme
    const [isSwitchedRememberMe, setIsSwitchedRememberMe] = useState (true);
    const [isSwitchedCGU, setIsSwitchedCGU] = useState ('checked');
    const [isSwitchedPrivacy, setIsSwitchedPrivacy] = useState ('checked');
    //State pour récupérer la valeur de l'identifiant et du mot de passe
    const [identifiant,setIdentifiant] = useState("")
    const [motDePasse, setMotDePasse] = useState("")
    const ForgotPassword = () =>{navigation.navigate(strings.tabs.forgottenPassword)}
    const checkLogin = () =>{
       async function loggin(){setIsLogged(await testDB(identifiant,motDePasse,isSwitchedRememberMe,isSwitchedPrivacy,isSwitchedCGU,dispatch));}
       loggin()
    }
    const toggleSwitch = () => setIsSwitchedRememberMe(previousState => !previousState)
        return(
            <SafeAreaView className="flex h-full w-full bg-white">

                <ScrollView >
                    <View className="m-10">
                <Image source={require('../../../assets/Logo')} style={strings.imageSize.logo} className="self-center"></Image>
                </View>

                    <View className="pb-6 pl-16 pr-16">
                    <TextInput onChangeText={handleChange} className= "border-solid border-2 rounded-lg pl-2 " placeholder='Identifiant :' value={identifiant}></TextInput>
                    </View>
                    <View className="pb-6 pl-16 pr-16">
                    <TextInput onChangeText={handlePasswordChange} className= "border-solid border-2 rounded-lg pl-2 " secureTextEntry={true} placeholder='Mot de passe :' value={motDePasse}></TextInput>
                    </View>
                    <View >
                        <Text onPress={ForgotPassword} className="text-center text-blue-500">Mot de passe oublié?</Text>
                    </View>
                    <View className="flex flex-row justify-center">
                        <Text className="self-center">Se souvenir de moi</Text>
                    <Switch  value={isSwitchedRememberMe} onValueChange={toggleSwitch} ></Switch>
                    </View>
                    <View className="m-2">
                    <Button title="Se connecter" onPress={checkLogin}></Button>
                    </View>
                    <View className="flex flex-row">
                        <Text className="self-center mr-2">J'accepte sans réserve les:</Text>
                    <View className="flex flex-row justify-center mr-2">
                        <Text onPress={()=> Linking.openURL('')} className="self-center text-blue-500 ">Conditions Générales D'utilisation</Text>
                    <Checkbox status={isSwitchedCGU} onPress={()=>{if(isSwitchedCGU == 'checked'){setIsSwitchedCGU('unchecked')}else{setIsSwitchedCGU('checked')}}}></Checkbox>
                    </View>
                    <View className="flex flex-row justify-center">
                        <Text onPress={()=> Linking.openURL('')} className="self-center text-blue-500">Politique de confidentialité</Text>
                    <Checkbox status={isSwitchedPrivacy} onPress={()=>{if(isSwitchedPrivacy == 'checked'){setIsSwitchedPrivacy('unchecked')}else{setIsSwitchedPrivacy('checked')}}}></Checkbox>
                    </View>
                    </View>

                </ScrollView>

            </SafeAreaView>
            )

};



export default Login;