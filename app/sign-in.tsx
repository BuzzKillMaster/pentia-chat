import {Pressable, SafeAreaView, Image, Text, StyleSheet, View} from 'react-native';
import {ReactElement, useContext} from "react";
import {SessionContext} from "../src/providers/SessionProvider";
import {Redirect} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import SocialSignInMethod from "../src/enums/SocialSignInMethod";

/**
 * Renders the sign-in screen.
 *
 * @returns {ReactElement} - A React element representing the sign-in screen.
 */
export default function SignIn(): ReactElement {
    const {signIn, user} = useContext(SessionContext)

    if (user) return <Redirect href={"/"} />

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/pc-icon.png')} style={styles.logo} />

            <Text style={styles.title}>Welcome to Pentia Chat</Text>
            <Text style={styles.description}>Join the community and start chatting with your friends.</Text>

            <View style={styles.separator}></View>

            <Pressable style={{
                ...styles.button,
                ...styles.googleButton,
            }} onPress={() => signIn(SocialSignInMethod.GOOGLE)}>
                <Image source={require('../assets/images/social/google.png')} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Sign in with Google</Text>
            </Pressable>

            <Pressable style={{
                ...styles.button,
                ...styles.facebookButton,
            }} onPress={() => signIn(SocialSignInMethod.FACEBOOK)}>
                <Ionicons name="logo-facebook" size={32} color={"#fff"} style={{
                    ...styles.buttonIcon,
                }} />
                <Text style={{
                    ...styles.buttonText,
                    color: '#fff',
                }}>Sign in with Facebook</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },

    logo: {
        width: 200,
        height: 200,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    description: {
        fontSize: 16,
        textAlign: 'center',
        maxWidth: "80%"
    },

    separator: {
        marginVertical: 12,
        height: 1,
        width: '50%',
        backgroundColor: '#eee',
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingHorizontal: 24,
        borderRadius: 50,
    },

    googleButton: {
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderWidth: 1,
    },

    facebookButton: {
        backgroundColor: '#3b5998',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#3b5998',
    },

    buttonIcon: {
        width: 32,
        height: 32,
        marginRight: 10,
    },

    buttonText: {
        fontSize: 18,
        fontWeight: '500',
    },
})