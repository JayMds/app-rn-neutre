
import React, { useContext, useEffect } from "react"
import { AuthContext } from "../../../global"
import {removeSessionId} from "../../utils/tools/saveSessionId";

const Logout = () =>{
    const [isLogged,setIsLogged] = useContext(AuthContext)
    useEffect(  () =>{
        async function logout(){
            setIsLogged(false)
            await removeSessionId('Session')
        }
        logout()
    },[]
    

    )
}

export default Logout;