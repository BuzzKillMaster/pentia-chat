import {createContext, ReactElement, ReactNode, useEffect, useState} from "react";
import {useRouter} from "expo-router";

type SessionProviderContextType = {
    signIn: () => void
    signOut: () => void
    isSignedIn: boolean
}

export const SessionContext = createContext<SessionProviderContextType>({} as SessionProviderContextType)

/**
 * Exposes session management to the wrapped component(s).
 * Intended to be used as a top-level context provider in the application, not for individual components.
 *
 * @param {ReactNode} children - The child components to render.
 * @returns {ReactElement} - The rendered child wrapped in a Session Context Provider.
 */
export default function SessionProvider({children}: {children: ReactNode}): ReactElement {
    const router = useRouter()

    const [isSignedIn, setIsSignedIn] = useState(false)

    useEffect(() => {
        if (isSignedIn) {
            router.replace("/")
        } else {
            router.replace("/sign-in")
        }
    }, [isSignedIn])

    const signIn = () => {
        // TODO: implement sign-in logic
        setIsSignedIn(true)
    }

    const signOut = () => {
        // TODO: implement sign-out logic
        setIsSignedIn(false)
    }

    return (
        <SessionContext.Provider value={{
            signIn,
            signOut,
            isSignedIn,
        }}>
            {children}
        </SessionContext.Provider>
    )
}