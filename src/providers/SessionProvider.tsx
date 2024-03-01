import {createContext, ReactElement, ReactNode, useEffect, useState} from "react";
import auth, {FirebaseAuthTypes} from "@react-native-firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {Alert} from "react-native";

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
})

type SessionProviderContextType = {
    signIn: () => void
    signOut: () => void
    user: FirebaseAuthTypes.User | null
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
    // TODO: Use this to display a loading screen where applicable
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

    useEffect(() => {
        // Implicitly returns its own cleanup function
        return auth().onAuthStateChanged((user) => {
            setUser(user)
            if (isLoading) setIsLoading(false)
        })
    }, [])

    // TODO: Implement Facebook sign-in
    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
            const {idToken} = await GoogleSignin.signIn()
            const credential = auth.GoogleAuthProvider.credential(idToken)
            await auth().signInWithCredential(credential)
        } catch (error) {
            Alert.alert('Uh-oh!', "It looks like we're having trouble signing you in. Please try again later.")
        }
    }

    const signOut = () => {
        // TODO: implement sign-out logic
        setIsSignedIn(false)
    }

    // Guard against rendering the children before the session state is loaded
    if (isLoading) return <></>

    return (
        <SessionContext.Provider value={{
            signIn,
            signOut,
            user
        }}>
            {children}
        </SessionContext.Provider>
    )
}