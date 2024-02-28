import {atom, useAtom} from 'jotai'
import useSessionStorage from "./useSessionStorage.js";
import {useEffect, useState} from "react";

export const tokenAtom = atom("")
export const isAuthenticatedAtom = atom(false)

export default function useAuth() {
    const [token, setToken_] = useAtom(tokenAtom)
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom)
    const [storageToken, setStorageToken] = useSessionStorage("token", "");
    const [isLoading, setIsLoading] = useState(true);


    function setToken(token) {
        setToken_(token)
        setStorageToken(token)
        setIsAuthenticated(true)
    }

    useEffect(() => {
        if (storageToken !== "" && token === "") {
            setToken(storageToken)
        }
        setIsLoading(false);

    }, []);


    return {
        token,
        setToken,
        isAuthenticated,
        isLoading,
        setIsAuthenticated,
        logout: () => {
            setToken_("")
            setStorageToken("")
            setIsAuthenticated(false)
        }
    }

}
