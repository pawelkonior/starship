import {atom, useAtom} from 'jotai'
import useLocalStorage from "./useLocalStorage.js";
import {useEffect} from "react";

export const tokenAtom = atom("")
export const isAuthenticatedAtom = atom(false)

export default function useAuth() {
    const [token, setToken_] = useAtom(tokenAtom)
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom)
    const [storageToken, setStorageToken] = useLocalStorage("token", "");


    function setToken(token) {
        setToken_(token)
        setStorageToken(token)
        setIsAuthenticated(true)
    }

    useEffect(() => {
        if (storageToken !== "" && token === "") {
            setToken(storageToken)
        }
    }, []);


    return {
        token,
        setToken,
        isAuthenticated,
        setIsAuthenticated,
        logout: () => {
            setToken_("")
            setStorageToken("")
            setIsAuthenticated(false)
        }
    }

}
