import React, {  useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext, PasswordContext } from '../../../global';
import strings from "../../utils/res/strings";
import OrderHistory from "../../pages/Orders/OrderHistory";
import Login from '../../pages/Auth/Login';
import Product from "../../pages/Product/Product";
import OrderDetails from '../../pages/Orders/OrderDetails';
import OpenHours from '../../pages/Shop/OpenHour';
import ProductCategories from "../../pages/Product/ProductCategories";
import ProductDetails from "../../pages/Product/ProductDetails";
import UserProfile from '../../pages/Auth/UserProfile';
import Orders from "../../pages/Orders/Orders";
import Logout from '../../pages/Auth/Logout';
import ForgottenPassword from '../../pages/Auth/ForgottenPassword';
import ChangePassword from '../../pages/Auth/ChangePassword';
import OrdersSettings from "../../pages/Orders/OrdersSettings";
import ShopRatings from '../../pages/Shop/ShopRatings';






const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const [changePassword,setChangePassword] = useState(false)
    const [isLogged,setIsLogged] = useState(false)
    console.log(changePassword)
    return (
    
        <AuthContext.Provider value={[isLogged,setIsLogged]}  >
        <PasswordContext.Provider value={[changePassword,setChangePassword]} >
        <Drawer.Navigator screenOptions={{drawerPosition : 'left'}} >
            
        {isLogged == true?
        changePassword == false ? 
            <>
            
            <Drawer.Screen name={strings.tabs.orders} component={Orders}/>

            <Drawer.Screen name={strings.tabs.product} component={Product}/>
            <Drawer.Screen name={strings.tabs.openHours} component={OpenHours} />
            {/*<Drawer.Screen name={strings.tabs.processOrderTime} component={ProcessOrderTime}/>*/}
            <Drawer.Screen name={strings.tabs.orderHistory} component={OrderHistory}/>
            <Drawer.Screen name={strings.tabs.ordersSettings} component={OrdersSettings}/>

            <Drawer.Screen name={strings.tabs.shopRatings} component={ShopRatings}/>

            <Drawer.Screen name={strings.tabs.productDetails} component={ProductDetails}  options={{
                drawerItemStyle: { display: "none" }
            }}/>
            <Drawer.Screen name={strings.tabs.orderDetails} component={OrderDetails} options={{
                drawerItemStyle: { display: "none" }
            }}/>
            <Drawer.Screen name={strings.tabs.categories} component={ProductCategories} options={{
                drawerItemStyle: { display: "none" }
            }}/>
            
            <Drawer.Screen name={strings.tabs.userProfile} component={UserProfile}/>
            <Drawer.Screen name ={strings.tabs.logout} component={Logout}/>
            </>
            :
            <Drawer.Screen name={strings.tabs.changePassword} component={ChangePassword} />
            :
            <>
            <Drawer.Screen name={strings.tabs.login} component={Login}/>
            <Drawer.Screen name={strings.tabs.forgottenPassword} component={ForgottenPassword} options={{drawerItemStyle : {display : "none"}}}/>
            </>
       }




            

        </Drawer.Navigator>
        </PasswordContext.Provider>
        </AuthContext.Provider>
    );
};

export default DrawerNavigator;
