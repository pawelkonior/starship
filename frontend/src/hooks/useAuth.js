import { atom, useAtom } from 'jotai'

export const tokenAtom = atom("")
export const isAuthenticatedAtom = atom(false)

export default function useAuth() {
    const [token, setToken_] = useAtom(tokenAtom)
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom)

    function setToken(token) {
        setToken_(token)
        setIsAuthenticated(true)
    }

    return {
        token, 
        setToken, 
        isAuthenticated, 
        setIsAuthenticated,
        logout: () => {
            setToken_("")
            setIsAuthenticated(false)
        }
    }

}
