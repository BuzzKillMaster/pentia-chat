import {Pressable, SafeAreaView, Text, StyleSheet} from 'react-native';
import {ReactElement, useContext} from "react";
import {SessionContext} from "../src/providers/SessionProvider";

/**
 * Renders the sign-in screen.
 *
 * @returns {ReactElement} - A React element representing the sign-in screen.
 */
export default function SignIn(): ReactElement {
    const {signIn} = useContext(SessionContext)

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