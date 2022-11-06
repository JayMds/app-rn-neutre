import 'expo-dev-client';
import {registerRootComponent} from "expo";
import {Provider} from "react-redux";
import DrawerNavigator from "./src/components/navigation/DrawerNavigator";
import {NavigationContainer} from "@react-navigation/native";
import {store} from "./src/redux/store";

export default function App() {

  return (
    <Provider store={store}>
            <NavigationContainer >
             <DrawerNavigator/>
            </NavigationContainer>
    </Provider>
  );
}
registerRootComponent(App)

