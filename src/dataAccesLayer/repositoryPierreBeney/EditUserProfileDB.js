
import { ToastAndroid } from "react-native"
import {getSessionId} from "../../utils/tools/saveSessionId";


const EditUserProfileDB = async(data,image,categoryID,shopRecordID,date,latitude,longitude,userProfile ) =>{
    let tab = date.split("/")
    date = tab[1] + '/' + tab[0] + '/' + tab[2]
    let dateBeforeUpdate = Date.parse(date)
    let dateUpdated = new Date(dateBeforeUpdate )
    dateUpdated.setHours(dateUpdated.getHours() + 2)
    try{
    const resp = await fetch('',{
    method : 'POST',
    headers: { 'Content-Type': 'application/json',
'Authorization' : 'Bearer ' + await getSessionId('Session') },
    body : JSON.stringify({
        ShopRecordID : shopRecordID,
        AccountType : 1,
        City : data.city,
        Email : data.email,
        Address : data.address,
        SuiteAddress : data.suiteAddress,
        ShopIcon : image,
        ShopName : data.shopName,
        ShopTags : data.shopTags,
        VATnumber : data.vatNumber,
        PostalCode : data.postalCode,
        Description : data.description,
        MobileNumber : data.mobileNumber,
        OwnerLastName : data.ownerLastName,
        ShopLegalName : data.shopLegalName,
        OwnerFirstName : data.ownerFirstName,
        TradeLicenseNo : data.tradeLicenseNo,
        TelephoneNumber : data.telephoneNumber,
        HeadquarterAddress : data.headquarterAddress,
        Longitude : longitude,
        Latitude : latitude,
        ShopCategoryId : categoryID,
        DateOfBirth : dateUpdated ,
        OwnerNationality : data.ownerNationality,
        OwnerCountry : data.ownerCountry,
        MangoPayWalletId : userProfile.mangoPayWalletId,
        MangoPayShopUserID : userProfile.mangoPayShopUserID
    })
    
})
const fetchedResponse = await resp.json()
if(fetchedResponse.payload != null){
ToastAndroid.show('Changements effectués!',ToastAndroid.SHORT)
return true
}else{
    ToastAndroid.show('Les données n\'ont pas étées enregistrées.Veuillez réessayer',ToastAndroid.SHORT)
}
    }
catch(error) {
    console.log(error)
}
}

export default EditUserProfileDB;