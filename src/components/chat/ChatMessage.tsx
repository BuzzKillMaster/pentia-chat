import {Dispatch, ReactElement, SetStateAction, useContext} from "react";
import {View, Text, Image, StyleSheet, Pressable} from "react-native";
import {SessionContext} from "../../providers/SessionProvider";
import ChatMessageType from "../../enums/ChatMessageType";
import ChatMessageSchema from "../../schemas/ChatMessageSchema";

interface ChatMessageProps {
    message: ChatMessageSchema
    setImage: Dispatch<SetStateAction<string | null>>
}

/**
 * Renders a chat message, including the sender's name and avatar.
 * The message is displayed on the right if the sender is the current user, and on the left otherwise.
 *
 * @param {ChatMessageSchema} message - The message to render.
 * @param {SetStateAction<string>} setImage - A function to set the image state when a message with an image is tapped.
 */
export default function ChatMessage({message, setImage}: ChatMessageProps): ReactElement {
    const {user} = useContext(SessionContext)

    /**
     * Renders the contents of the message, based on its media type.
     */
    const renderContents = (): ReactElement => {
        switch (message.mediaType) {
            case ChatMessageType.TEXT:
                return <Text style={{
                    ...styles.message,
                    backgroundColor: message.senderId === user?.uid ? "#2fa69f" : "#d3e5f4",
                    color: message.senderId === user?.uid ? "#fff" : "#000",
                }}>{message.contents}</Text>
            case ChatMessageType.IMAGE:
                return (
                    <Pressable onPress={() => setImage(message.contents)}>
                        <Image source={{uri: message.contents}} style={styles.image} />
                    </Pressable>
                )
            default:
                return <Text>Unknown message type</Text>
        }
    }

    /**
     * Renders the sender information, including their avatar and name.
     *
     * @returns {ReactElement} The rendered sender information component.
     */
    const renderSenderInfo = (): ReactElement => {
        return (
            <View style={styles.senderInfoContainer}>
                <Image source={{uri: message.senderAvatar}} style={styles.senderAvatar} />
                <Text style={styles.senderName}>{message.senderName}</Text>
            </View>
        )
    }

    /**
     * Renders a timestamp for a given message in a HH:MM format.
     *
     * @return {ReactElement} The rendered timestamp component.
     */
    const renderTimestamp = (): ReactElement => {
        return (
            <Text style={styles.timestamp}>{
                message.createdAt?.toISOString()
                    .split("T")[1]
                    .split(".")[0]
                    .split(":")
                    .slice(0, 2)
                    .join(":")
            }</Text>
        )
    }

    return (
        <View style={{
            ...styles.container,
            alignItems: message.senderId === user?.uid ? "flex-end" : "flex-start",
        }}>
            {message.senderId !== user?.uid && renderSenderInfo()}

            {renderContents()}
            {renderTimestamp()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
        gap: 8,
    },

    text: {
        fontSize: 16,
    },

    image: {
        width: 200,
        height: 200,
        borderRadius: 20,
    },

    senderInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    senderName: {
        fontSize: 12,
        opacity: 0.5,
        fontWeight: "500",
    },

    senderAvatar: {
        width: 20,
        height: 20,
        borderRadius: 20,
    },

    timestamp: {
        fontSize: 10,
        opacity: 0.5,
        fontWeight: "500",
    },

    message: {
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 15,
        color: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        maxWidth: "80%",
    }
})