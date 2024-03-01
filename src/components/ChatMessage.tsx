import {ReactElement} from "react";
import {View, Text} from "react-native";

export default function ChatMessage({message}: { message: ChatMessageSchema }): ReactElement {
    return (
        <View>
            <Text>{message.contents}</Text>
        </View>
    )
}