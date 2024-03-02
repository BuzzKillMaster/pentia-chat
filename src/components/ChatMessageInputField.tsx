import {ReactElement, useContext, useEffect, useState} from "react";
import {Alert, Pressable, StyleSheet, TextInput, View} from "react-native";
import {SessionContext} from "../providers/SessionProvider";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import {Ionicons} from "@expo/vector-icons";

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
    const [userWantsNotifications, setUserWantsNotifications] = useState<boolean | undefined | null>()

    useEffect(() => {
        (async () => {
            const wantsNotifications = await AsyncStorage.getItem("userWantsNotifications")

            switch (wantsNotifications) {
                case "true":
                case "false":
                    setUserWantsNotifications(wantsNotifications === "true")
                    break
                default:
                    setUserWantsNotifications(null)
            }
        })()
    }, [])

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
                createdAt: firestore.FieldValue.serverTimestamp()
            }).catch(_ => {
            Alert.alert("Uh-oh!", "It looks like we're having trouble sending your message. Please try again later.")
        }).then(_ => {
            setMessageContents("")
            checkUserWantsNotifications()
        })
    }

    /**
     * Checks if the user wants to receive notifications for new messages in a chat group.
     * If the user's preference is not set, it shows an alert asking for their preference and updates the preference accordingly.
     *
     * @returns {Promise<void>} - A promise that resolves once the user's preference is set.
     */
    const checkUserWantsNotifications = async (): Promise<void> => {
        if (userWantsNotifications !== null) return

        Alert.alert("Hey there!", "We noticed you haven't set your notification preferences yet. Would you like to receive notifications for new messages in this chat group?", [
            {
                text: "Yes, please!",
                onPress: async () => {
                    const permission = await Notifications.requestPermissionsAsync()

                    if (permission.status === "granted") {
                        await AsyncStorage.setItem("userWantsNotifications", "true")
                        setUserWantsNotifications(true)
                    } else if (permission.status === "denied") {
                        await AsyncStorage.setItem("userWantsNotifications", "false")
                        setUserWantsNotifications(false)

                        Alert.alert("Uh-oh!", "It looks like you've denied notifications. You can change this in your device's settings.")
                    }
                }
            },
            {
                text: "No, thanks.",
                onPress: async () => {
                    await AsyncStorage.setItem("userWantsNotifications", "false")
                    setUserWantsNotifications(false)
                }
            }
        ])
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.iconButton}>
                <Ionicons name="camera" size={24} />
            </Pressable>

            <Pressable style={styles.iconButton}>
                <Ionicons name="image" size={24} />
            </Pressable>

            <TextInput
                style={styles.input}
                placeholder={"Type a message"}
                value={messageContents}
                onChangeText={setMessageContents}
                blurOnSubmit={false}
                onSubmitEditing={({nativeEvent}) => sendMessage(nativeEvent.text)}
            />

            <Pressable style={styles.iconButton} onPress={() => sendMessage(messageContents)}>
                <Ionicons name="send" size={24} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'stretch',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },

    iconButton: {
        padding: 10,
        justifyContent: 'center',
    },

    input: {
        width: '100%',
        padding: 10,
        backgroundColor: '#eee',
        flexShrink: 1,
    },
})