import {ReactElement, useCallback, useEffect, useState} from "react";
import {StyleSheet, SafeAreaView, Alert, FlatList, ActivityIndicator} from "react-native";
import {Stack, useLocalSearchParams} from "expo-router";
import firestore from "@react-native-firebase/firestore";
import ChatMessage from "../../../src/components/chat/ChatMessage";
import ChatMessageInputField from "../../../src/components/chat/ChatMessageInputField";
import firestoreDocumentToChatMessage from "../../../src/utilities/firestoreDocumentToChatMessage";
import ChatMessageSchema from "../../../src/schemas/ChatMessageSchema";
import EmptyStateScreen from "../../../src/components/utility/EmptyStateScreen";
import LightBoxComponent from "../../../src/components/LightBoxComponent";

const MESSAGES_PER_PAGE = 50

/**
 * Renders a chat group based on the group ID in the URL.
 * Uses the room name, as per the route, to fetch the chat messages for the room.
 *
 * @returns {ReactElement} - A React element representing the chat room and its contents.
 */
export default function ChatGroup(): ReactElement {
    const {group, name} = useLocalSearchParams<{group: string, name: string}>()

    const [messages, setMessages] = useState<ChatMessageSchema[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [lightBoxImageUrl, setLightBoxImageUrl] = useState<string | null>(null)

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

    useEffect(() => {
        if (messages !== null) {
            setIsLoading(false)
        }
    }, [messages])

    /**
     * Fetches more messages from the chat group's collection in Firestore.
     *
     * @returns {Promise<void>} A Promise that resolves when the messages are fetched and processed.
     */
    const fetchMoreMessages = async (): Promise<void> => {
        if (messages === null || messages.length % MESSAGES_PER_PAGE !== 0) return

        const lastMessage = messages[messages.length - 1]

        // TODO: Ensure that this does not throw any errors when the total number of messages is divisible by MESSAGES_PER_PAGE
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

    /**
     * Renders a list item for a chat message.
     *
     * @param {ChatMessageSchema} message - The properties for the list item.
     * @returns {ReactElement} The rendered list item.
     */
    const renderListItem = useCallback((message: ChatMessageSchema): ReactElement => {
        return <ChatMessage message={message} setImage={setLightBoxImageUrl} />
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: name,
                }}
            />

            {isLoading && (
                <ActivityIndicator size={"large"} style={{
                    flex: 1,
                }}></ActivityIndicator>
            )}

            {lightBoxImageUrl && (
                <LightBoxComponent imageUrl={lightBoxImageUrl} setImage={setLightBoxImageUrl} />
            )}

            {messages?.length === 0 && (
                <EmptyStateScreen
                    image={require("../../../assets/images/no-messages.png")}
                    title={"No messages yet"}
                    message={"Be the first to send a message in this chat group!"}
                />
            )}

            {(messages !== null && messages.length > 0) && (
                <FlatList
                    style={styles.conversation}
                    data={messages}
                    renderItem={({item}) => renderListItem(item)}
                    keyExtractor={item => item.id}
                    inverted={true}
                    onEndReached={fetchMoreMessages}
                />
            )}

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