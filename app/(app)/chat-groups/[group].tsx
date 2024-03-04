import {ReactElement, useEffect, useState} from "react";
import {StyleSheet, SafeAreaView, Alert, FlatList} from "react-native";
import {useLocalSearchParams} from "expo-router";
import firestore from "@react-native-firebase/firestore";
import ChatMessage from "../../../src/components/ChatMessage";
import ChatMessageInputField from "../../../src/components/ChatMessageInputField";
import firestoreDocumentToChatMessage from "../../../src/utilities/firestoreDocumentToChatMessage";
import ChatMessageSchema from "../../../src/schemas/ChatMessageSchema";

const MESSAGES_PER_PAGE = 50

/**
 * Renders a chat group based on the group ID in the URL.
 * Uses the room name, as per the route, to fetch the chat messages for the room.
 *
 * @returns {ReactElement} - A React element representing the chat room and its contents.
 */
export default function ChatGroup(): ReactElement {
    const {group} = useLocalSearchParams<{group: string}>()

    const [messages, setMessages] = useState<ChatMessageSchema[]>([])

    useEffect(() => {
        // Implicitly returns its own cleanup function
        return firestore()
            .collection("chat-groups")
            .doc(group)
            .collection("messages")
            .limit(MESSAGES_PER_PAGE)
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                const messages = snapshot.docs.map(firestoreDocumentToChatMessage)

                setMessages(messages)
            }, _ => {
                Alert.alert("Uh-oh!", "It looks like we're having trouble fetching the messages. Please try again later.")
            })
    }, [])

    /**
     * Fetches more messages from the chat group's collection in Firestore.
     *
     * @returns {Promise<void>} A Promise that resolves when the messages are fetched and processed.
     */
    const fetchMoreMessages = async (): Promise<void> => {
        const lastMessage = messages[messages.length - 1]

        const snapshot = await firestore()
            .collection("chat-groups")
            .doc(group)
            .collection("messages")
            .limit(MESSAGES_PER_PAGE)
            .orderBy("createdAt", "desc")
            .startAfter(lastMessage.createdAt)
            .get()

        const newMessages = snapshot.docs.map(firestoreDocumentToChatMessage)

        setMessages([...messages, ...newMessages])
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.conversation}
                data={messages}
                renderItem={({item}) => <ChatMessage message={item} />}
                keyExtractor={item => item.id}
                inverted={true}
                onEndReached={fetchMoreMessages}
            />

            <ChatMessageInputField group={group} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    conversation: {
        flex: 1,
        width: '100%',
    },
})