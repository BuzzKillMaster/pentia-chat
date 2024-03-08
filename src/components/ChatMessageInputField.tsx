import {ReactElement, useContext, useEffect, useState} from "react";
import {Alert, Pressable, StyleSheet, TextInput, View} from "react-native";
import {SessionContext} from "../providers/SessionProvider";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import {Ionicons} from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import {ImagePickerResult} from "expo-image-picker";
import ChatMessageType from "../enums/ChatMessageType";
import messaging from '@react-native-firebase/messaging';

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
            const wantsNotifications = await AsyncStorage.getItem("userWantsNotifications-" + group)

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
                mediaType: ChatMessageType.TEXT,
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
                        await AsyncStorage.setItem("userWantsNotifications-" + group, "true")
                        setUserWantsNotifications(true)
                        if (group) await messaging().subscribeToTopic(group)
                    } else if (permission.status === "denied") {
                        await AsyncStorage.setItem("userWantsNotifications-" + group, "false")
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


    /**
     * Uploads an image picker result to storage and adds a new message to the chat group
     * @param {ImagePickerResult | void} result - The result object returned from the image picker. If void or the result is canceled, no action will be taken.
     */
    const uploadImagePickerResult = (result: ImagePickerResult | void) => {
        if (!result || result.canceled) return

        const uri = result.assets[0].uri
        const path = group + "/" + new Date().getTime()

        const ref = storage().ref("chat-images").child(path)

        ref.putFile(uri).catch(_ => {
            Alert.alert("Uh-oh!", "It looks like we're having trouble uploading your image. Please try again later.")
        }).then(async () => {
            const url = await ref.getDownloadURL()

        firestore()
            .collection("chat-groups")
            .doc(group)
            .collection("messages")
            .add({
                contents: url,
                mediaType: ChatMessageType.IMAGE,
                senderName: user?.displayName,
                senderAvatar: user?.photoURL,
                senderId: user?.uid,
                createdAt: firestore.FieldValue.serverTimestamp()
            }).catch(_ => {
                Alert.alert("Uh-oh!", "It looks like we're having trouble sending your message. Please try again later.")
            }).then(_ => {
                checkUserWantsNotifications()
            })
        })
    }

    /**
     * Opens the image library and allows the user to select an image.
     */
    const pickImage = () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        }).catch(_ => {
            Alert.alert("Uh-oh!", "It looks like we were unable to open your gallery. Please try again later.")
        }).then(uploadImagePickerResult)
    }


    /**
     * Opens the camera and allows the user to take a photo.
     */
    const takePhoto = () => {
        ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        }).catch(_ => {
            Alert.alert("Uh-oh!", "It looks like we were unable to open your camera. Please try again later.")
        }).then(uploadImagePickerResult)
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageOptionsContainer}>
                <Pressable style={styles.iconButton} onPress={takePhoto}>
                    <Ionicons name="camera" size={24} color={"#29928c"} />
                </Pressable>

                <Pressable style={styles.iconButton} onPress={pickImage}>
                    <Ionicons name="image" size={24} color={"#29928c"} />
                </Pressable>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={"Type a message"}
                    value={messageContents}
                    onChangeText={setMessageContents}
                    blurOnSubmit={false}
                    onSubmitEditing={({nativeEvent}) => sendMessage(nativeEvent.text)}
                />

                <Pressable style={{
                    ...styles.iconButton,
                    ...styles.sendButton
                }} onPress={() => sendMessage(messageContents)}>
                    <Ionicons name="send" size={24} color={
                        messageContents.trim() === "" ? "#888" : "#29928c"
                    } />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 10,
    },

    imageOptionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    inputContainer: {
        flex: 1,
        marginHorizontal: 10,
    },

    iconButton: {
        padding: 10,
        justifyContent: 'center',
    },

    sendButton: {
        position: 'absolute',
        right: 10,
        bottom: 0,
        top: 0,
    },

    input: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#ddd',
        flexShrink: 1,
        borderRadius: 25,
        paddingRight: 24 + 20 + 10 // Send icon width + send icon padding + input padding
    },
})