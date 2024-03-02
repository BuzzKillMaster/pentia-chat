import {ReactElement, useContext, useState} from "react";
import {Alert, StyleSheet, TextInput} from "react-native";
import {SessionContext} from "../providers/SessionProvider";
import firestore from "@react-native-firebase/firestore";

/**
 * Renders an input field for sending messages in a chat group.
 *
 * @param {string} group - The ID of the chat group.
 *
 * @returns {ReactElement} The rendered input field component.
 */
export default function ChatMessageInputField({group}: { group: string | undefined }): ReactElement {
    const {user} = useContext(SessionContext)

    const [messageContents, setMessageContents] = useState<string>("")

    /**
     * Sends a message to a chat group, using the current user's information.
     *
     * @param {string} message - The contents of the message to send.
     */
    const sendMessage = async (message: string): Promise<void> => {
        message = message.trim()
        if (message === "") return

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
        <TextInput
            style={styles.input}
            placeholder={"Type a message"}
            value={messageContents}
            onChangeText={setMessageContents}
            blurOnSubmit={false}
            onSubmitEditing={({nativeEvent}) => sendMessage(nativeEvent.text)}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        padding: 20,
        backgroundColor: '#eee',
    },
})