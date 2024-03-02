import {ReactElement, useContext} from "react";
import {View, Text, Image} from "react-native";
import {SessionContext} from "../providers/SessionProvider";

/**
 * Renders a chat message, including the sender's name and avatar.
 * The message is displayed on the right if the sender is the current user, and on the left otherwise.
 *
 * @param {ChatMessageSchema} message - The message to render.
 */
export default function ChatMessage({message}: { message: ChatMessageSchema }): ReactElement {
    const {user} = useContext(SessionContext)

    return (
        <View style={{
            flex: 1,
            alignItems: message.senderId === user?.uid ? "flex-end" : "flex-start",
        }}>
            <Text>{message.contents}</Text>
            <Text>{message.createdAt?.toISOString()}</Text>
            <Text>{message.senderName}</Text>
            <Image source={{uri: message.senderAvatar}} style={{width: 50, height: 50}} />
        </View>
    )
}