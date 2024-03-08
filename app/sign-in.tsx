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
            <Image source={require('../assets/images/welcome-background.png')} style={styles.background} />
            <View style={styles.overlay}></View>

            <View style={styles.content}>
                <Text style={{
                    ...styles.text,
                    ...styles.title,
                }}>
                    Join the conversation and share your views.
                </Text>

                <Text style={{
                    ...styles.text,
                    ...styles.description
                }}>
                    Discover communities and connect with people from around the world.
                </Text>

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
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    content: {
        padding: 24,
        gap: 16
    },

    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
    },

    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    text: {
        color: "#fff",
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 8,
    },

    title: {
        fontWeight: 'bold',
        fontSize: 36,
    },

    description: {
        fontSize: 20,
        fontWeight: "500",
        maxWidth: "80%",
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingHorizontal: 24,
        borderRadius: 50,
        justifyContent: 'center',
    },

    googleButton: {
        backgroundColor: '#fff',
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