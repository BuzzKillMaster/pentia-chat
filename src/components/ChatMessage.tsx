import {ReactElement, useContext} from "react";
import {View, Text, Image, StyleSheet} from "react-native";
import {SessionContext} from "../providers/SessionProvider";
import ChatMessageType from "../enums/ChatMessageType";
import ChatMessageSchema from "../schemas/ChatMessageSchema";

/**
 * Renders a chat message, including the sender's name and avatar.
 * The message is displayed on the right if the sender is the current user, and on the left otherwise.
 *
 * @param {ChatMessageSchema} message - The message to render.
 */
export default function ChatMessage({message}: { message: ChatMessageSchema }): ReactElement {
    const {user} = useContext(SessionContext)

    /**
     * Renders the contents of the message, based on its media type.
     */
    const renderContents = (): ReactElement => {
        switch (message.mediaType) {
            case ChatMessageType.TEXT:
                return <Text style={{
                    ...styles.message,
                    backgroundColor: message.senderId === user?.uid ? "#00824b" : "#4b0082",
                }}>{message.contents}</Text>
            case ChatMessageType.IMAGE:
                // TODO: Allow users to tap on the image to view it in full screen.
                return <Image source={{uri: message.contents}} style={styles.image} />
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
        borderRadius: 5,
    },

    senderInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    senderName: {
        fontSize: 14,
        fontWeight: "500",
    },

    senderAvatar: {
        width: 25,
        height: 25,
        borderRadius: 5,
    },

    timestamp: {
        fontSize: 12,
    },

    message: {
        fontSize: 16,
        padding: 12,
        color: "#fff",
        borderRadius: 5,
        maxWidth: "80%",
    }
})