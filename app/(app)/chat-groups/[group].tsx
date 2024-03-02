import {ReactElement, useContext, useEffect, useState} from "react";
import {StyleSheet, SafeAreaView, TextInput, Alert, FlatList} from "react-native";
import {useLocalSearchParams} from "expo-router";
import firestore from "@react-native-firebase/firestore";
import ChatMessage from "../../../src/components/ChatMessage";
import {SessionContext} from "../../../src/providers/SessionProvider";

const MESSAGES_PER_PAGE = 50

/**
 * Renders a chat group based on the group ID in the URL.
 * Uses the room name, as per the route, to fetch the chat messages for the room.
 *
 * @returns {ReactElement} - A React element representing the chat room and its contents.
 */
export default function ChatGroup(): ReactElement {
    const {group} = useLocalSearchParams<{group: string}>()

    const {user} = useContext(SessionContext)

    const [messages, setMessages] = useState<ChatMessageSchema[]>([])
    const [messageContents, setMessageContents] = useState<string>("")

    useEffect(() => {
        // Implicitly returns its own cleanup function
        return firestore()
            .collection("chat-groups")
            .doc(group)
            .collection("messages")
            .limit(MESSAGES_PER_PAGE)
            .orderBy("created_at", "asc")
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

    /**
     * Sends a message to a chat group, using the current user's information.
     *
     * @param {string} message - The contents of the message to send.
     */
    const sendMessage = async (message: string): Promise<void> => {
        firestore()
            .collection("chat-groups")
            .doc(group)
            .collection("messages")
            .add({
                contents: message,
                senderName: user?.displayName,
                senderAvatar: user?.photoURL,
                senderId: user?.uid,
                created_at: firestore.FieldValue.serverTimestamp()
            }).catch(_ => {
                Alert.alert("Uh-oh!", "It looks like we're having trouble sending your message. Please try again later.")
            }).then(_ => setMessageContents(""))
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.conversation}
                data={messages}
                renderItem={({item}) => <ChatMessage message={item} />}
                keyExtractor={item => item.id}
            />


            <TextInput
                style={styles.input}
                placeholder={"Type a message"}
                value={messageContents}
                onChangeText={setMessageContents}
                blurOnSubmit={false}
                onSubmitEditing={({nativeEvent}) => sendMessage(nativeEvent.text)}
            />
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

    input: {
        width: '100%',
        padding: 20,
        backgroundColor: '#eee',
    },
})
