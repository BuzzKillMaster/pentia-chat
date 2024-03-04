import {ReactElement, useContext} from "react";
import {View, Text, Image} from "react-native";
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
    const renderContents = () => {
        switch (message.mediaType) {
            case ChatMessageType.TEXT:
                return <Text>{message.contents}</Text>
            case ChatMessageType.IMAGE:
                // TODO: Allow users to tap on the image to view it in full screen.
                return <Image source={{uri: message.contents}} style={{width: 200, height: 200}} />
            default:
                return <Text>Unknown message type</Text>
        }
    }

    return (
        <View style={{
            flex: 1,
            alignItems: message.senderId === user?.uid ? "flex-end" : "flex-start",
        }}>
            {renderContents()}
            <Text>{message.createdAt?.toISOString()}</Text>
            <Text>{message.senderName}</Text>
            <Image source={{uri: message.senderAvatar}} style={{width: 50, height: 50}} />
        </View>
    )
}