import {ReactElement, useEffect, useState} from "react";
import {StyleSheet, SafeAreaView, View, Alert} from "react-native";
import {useLocalSearchParams} from "expo-router";
import firestore from "@react-native-firebase/firestore";
import ChatMessage from "../../../src/components/ChatMessage";

const MESSAGES_PER_PAGE = 50

/**
 * Renders a chat group based on the group ID in the URL.
 * Uses the room name, as per the route, to fetch the chat messages for the room.
 *
 * @returns {ReactElement} - A React element representing the chat room and its contents.
 */
export default function ChatGroup(): ReactElement {
    const {group} = useLocalSearchParams<{group: string}>()

    const [messages, setMessages] = useState<ChatMessageChema[]>([])

    useEffect(() => {
        return firestore()
            .collection("chat-groups")
            .doc(group)
            .collection("messages")
            .limit(MESSAGES_PER_PAGE)
            .onSnapshot((snapshot) => {
                const messages = snapshot.docs.map(doc => {
                    const message = doc.data() as ChatMessageChema

                    return {
                        ...message,
                        id: doc.id,
                        createdAt: doc.data().created_at.toDate()
                    }
                })
                setMessages(messages)
            }, _ => {
                Alert.alert("Uh-oh!", "It looks like we're having trouble fetching the messages. Please try again later.")
            })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.conversation}>
                {messages.map(message =>  (
                    <ChatMessage key={message.id} message={message} />
                ))}
            </View>
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
