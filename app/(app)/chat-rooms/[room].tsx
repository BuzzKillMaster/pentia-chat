import {ReactElement} from "react";
import {Text, StyleSheet, SafeAreaView} from "react-native";
import {useLocalSearchParams} from "expo-router";


/**
 * Renders a chat room based on the room name in the URL.
 * Uses the room name, as per the route, to fetch the chat messages for the room.
 *
 * @returns {ReactElement} - A React element representing the chat room and its contents.
 */
export default function ChatRooms(): ReactElement {
    const {room} = useLocalSearchParams<{room: string}>()

    return (
        <SafeAreaView style={styles.container}>
            <Text>Chat Room ({room})</Text>
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
