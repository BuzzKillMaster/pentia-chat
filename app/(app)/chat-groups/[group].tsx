import {ReactElement, useEffect, useState} from "react";
import {StyleSheet, SafeAreaView, Alert, FlatList} from "react-native";
import {useLocalSearchParams} from "expo-router";
import firestore from "@react-native-firebase/firestore";
import ChatMessage from "../../../src/components/ChatMessage";
import ChatMessageInputField from "../../../src/components/ChatMessageInputField";

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
            .orderBy("created_at", "desc")
            .onSnapshot((snapshot) => {
                const messages = snapshot.docs.map(doc => {
                    const message = doc.data()

                    return {
                        ...message,
                        id: doc.id,
                        createdAt: doc.data().created_at?.toDate()
                    } as ChatMessageSchema
                })
                setMessages(messages)
            }, _ => {
                Alert.alert("Uh-oh!", "It looks like we're having trouble fetching the messages. Please try again later.")
            })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.conversation}
                data={messages}
                renderItem={({item}) => <ChatMessage message={item} />}
                keyExtractor={item => item.id}
                inverted={true}
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
