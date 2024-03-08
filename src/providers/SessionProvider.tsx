import {createContext, ReactElement, ReactNode, useEffect, useState} from "react";
import auth, {FirebaseAuthTypes} from "@react-native-firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {Alert} from "react-native";
import LoadingScreen from "../components/LoadingScreen";
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import SocialSignInMethod from "../enums/SocialSignInMethod";

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
})

type SessionProviderContextType = {
    signIn: (method: SocialSignInMethod) => void
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
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

    useEffect(() => {
        // Implicitly returns its own cleanup function
        return auth().onAuthStateChanged((user) => {
            setUser(user)
            if (isLoading) setIsLoading(false)
        })
    }, [])

    /**
     * Sign in using a social media method.
     *
     * @param {SocialSignInMethod} method - The social media method to sign in with.
     * @returns {Promise<void>} - A promise that resolves when the sign-in process is complete.
     */
    const signIn = async (method: SocialSignInMethod): Promise<void> => {
        switch (method) {
            case SocialSignInMethod.GOOGLE:
                await signInWithGoogle()
                break
            case SocialSignInMethod.FACEBOOK:
                await signInWithFacebook()
                break
        }
    }

    /**
     * Attempt to sign in the user through their Google account.
     *
     * @returns {Promise<void>} Resolves when the sign in operation is complete.
     */
    const signInWithGoogle = async (): Promise<void> => {
        setIsLoading(true)

        try {
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
            const {idToken} = await GoogleSignin.signIn()
            const credential = auth.GoogleAuthProvider.credential(idToken)
            await auth().signInWithCredential(credential)
        } catch (error) {
            Alert.alert('Uh-oh!', "It looks like we're having trouble signing you in. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Attempt to sign in the user through their Facebook account.
     *
     * @returns {Promise<void>} Resolves when the sign in operation is complete.
     */
    const signInWithFacebook = async (): Promise<void> => {
        setIsLoading(true)

        try {
            await LoginManager.logInWithPermissions(['public_profile', 'email'])
            const data = await AccessToken.getCurrentAccessToken()
            const facebookCredential = auth.FacebookAuthProvider.credential(data!.accessToken);
            await auth().signInWithCredential(facebookCredential)
        } catch (error) {
            Alert.alert('Uh-oh!', "It looks like we're having trouble signing you in. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Sign the user out of their account.
     *
     * @returns {Promise<void>} Resolves when the sign out operation is complete.
     */
    const signOut = async (): Promise<void> => {
        Alert.alert("Sign out", "Are you sure you want to sign out?", [
            {
                text: "No thanks",
            },
            {
                text: "Yes, please",
                onPress: async () => {
                    setIsLoading(true)
                    await auth().signOut()
                }
            }]
        )
    }

    return (
        <SessionContext.Provider value={{
            signIn,
            signOut,
            user
        }}>
            {isLoading && <LoadingScreen />}
            {children}
        </SessionContext.Provider>
    )
}