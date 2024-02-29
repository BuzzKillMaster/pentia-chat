import {Pressable, SafeAreaView, StyleSheet, Text} from 'react-native';
import {ReactElement, useContext} from "react";
import {useRouter} from "expo-router";
import {SessionContext} from "../../src/providers/SessionProvider";

/**
 * Render the home page of the application.
 * This is the default page that is shown when the app is opened,
 * as long as the user is authenticated.
 *
 * @returns {ReactElement} The rendered home page component.
 */
export default function HomePage(): ReactElement {
    const router = useRouter()

    const {signOut} = useContext(SessionContext)

    return (
        <SafeAreaView style={styles.container}>
            <Text>App</Text>

            <Pressable onPress={() => router.push("/chat-rooms/general")}>
                <Text>Open Chat</Text>
            </Pressable>

            <Pressable onPress={signOut}>
                <Text>Sign Out</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap:  20
    }
})