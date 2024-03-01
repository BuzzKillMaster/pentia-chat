import {Pressable, SafeAreaView, Text, StyleSheet} from 'react-native';
import {ReactElement, useContext} from "react";
import {SessionContext} from "../src/providers/SessionProvider";
import {Redirect} from "expo-router";

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
            <Pressable onPress={signIn}>
                <Text>Sign In</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})