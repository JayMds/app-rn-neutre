import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import {Platform, Alert} from 'react-native';
import {Audio} from "expo-av";
import { useNavigation} from "@react-navigation/native";
import strings from "../../utils/res/strings";
import {useDispatch, useSelector} from "react-redux";
import {exportedOrderHistoryStore, exportedOrderStore} from "../../redux/slices/orderSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {findLatestOrderID} from "../../utils/tools/compareArray";
import {useInterval} from "../../utils/tools/IntervalFunction";
import {getCurrentOrders, loadOrderHystory, loadOrderList} from "../../dataAccesLayer/repositoryJCmendes/OrderRepo";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

const BACKGROUND_FETCH_TASK = 'background-fetch';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();
    console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
    const delay = 1000 * strings.global.refreshRate;
    const currentOrders  = await getCurrentOrders()
    console.log()
    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundFetchAsync() {

    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 1, // 15 minutes
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
}
Notifications.setNotificationHandler({              //Configuration des notifications mobiles
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function AlarmModule() {

    /**
     * States Notifications
     */
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    /**
     * Sound
     * Creation => Load(création) => Config(looping) => Play
     * Unload(touch notif or cancel alert)
     */
    const sound = new Audio.Sound();                                                        // Création du composant sonore
    async function loadSound() {
        await Audio.setAudioModeAsync({                                              // Configuration du composant sonore
            allowsRecordingIOS: false,                                                    // Autorisation d'enregistrement
            staysActiveInBackground: true,                                             // Autorisation de rester actif en arrière plan
            interruptionModeIOS: 1,                                                           // Interruption de l'audio (autres applis)
            playsInSilentModeIOS: true,                                                  // Autorisation de jouer en mode silencieux
            shouldDuckAndroid: true,                                                 // Autorisation de baisser le son  (autres applis)
            interruptionModeAndroid: 1,                                              // Interruption de l'audio (autres applis)
            playThroughEarpieceAndroid: false                                    // Autorisation de jouer par l'écouteur
        });
        console.log('Loading Sound;')
        await sound.loadAsync(require('../../../assets/BrassNotif.wav'));               // Chargement du fichier de son
        await sound.setIsLoopingAsync(true)                                 //Configuration du son en boucle
        await sound.playAsync()                                                      //Lecture du son
    }
    async function unloadSound(){                                                    //Fonction de déchargement du fichier de son
        console.log('Unloading Sound');
        await sound.unloadAsync();
    }


    /**
     * REFRESH ORDER LIST INTERVALL (ms)
     */
    const delay = 1000 * strings.global.refreshRate;
    const dispatch = useDispatch();
    useInterval(() => {
        loadOrderHystory(dispatch);
        loadOrderList(dispatch)
    }, delay);

    const orders = useSelector(exportedOrderStore);
    const orderHistory = useSelector(exportedOrderHistoryStore);
    const lastorderId = useRef(0);


    /**
     * A chaque fois que le store orders est modifié, si la liste des commandes n'est pas vide
     * on cherche le plus grand orderID pour trouver une nouvelle commande
     * si une  nouvelle commande est trouvée, on envoie une notification, puis on déclenche l'alerte et le son
     */
    useEffect(() => {
        console.log('entrée dans le useEffect');
        if (orders.length > 0) {
            const res = findLatestOrderID(orders)
            console.log('commande en cours:', res);
            console.log('ref:',lastorderId)
            if( res > lastorderId.current) {
                console.log('Nouvelle commande détectée!');
                try {
                    console.log('notif')
                    sendPushNotification(expoPushToken);
                } catch (error) {
                    console.log(error);
                }
                lastorderId.current = res;
            }
        } else {console.log('Pas de nouvelle commande')}
        console.log('sortie du useEffect');
    },[orders])

    /**
     * A la création du composant: si l'historique de commande n'est pas vide, on cherche le plus grand orderID -> ref
     * - on enregistre le token pour les notifications
     * - on crée l'event listener pour détecter la réception d'une notif et déclencher l'alerte et le son
     * - on crée le response listener pour décharger le son lors d'une réponse (de l'utilisateur) à une notification
     */
    useEffect(() => {
        if (orderHistory.length !== 0){
            lastorderId.current = findLatestOrderID(orderHistory);
        }
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(
            notification => {
            setNotification(notification);
            loadSound();
            showAlert(sound); // permet le dechargement de sound via l'alerte (cancel)
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            response => {
            console.log(response);
            unloadSound();
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    let showAlert = (sound) => {
        Alert.alert(
            'Nouvelle Commande!',
            ' Au moins une nouvelle commande en attente!',
            [
                {
                    text: 'Voir les commandes',
                    onPress: () => { sound.unloadAsync(); navigation.navigate(strings.tabs.orders);},
                    style: 'cancel'
                },
            ],
            {
                cancelable: false,
            }
        );
    }
    const navigation = useNavigation()

}


async function sendPushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Nouvelle Commande reçue",
            body: 'Une commande est en attende de traitement',
            data: { data: '' },
            vibrate: false
        },
        trigger: null,
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    await AsyncStorage.setItem('pushToken', token);
    return token;
}
