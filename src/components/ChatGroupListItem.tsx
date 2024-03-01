import ChatGroupSchema from "../schemas/ChatGroupSchema";
import {ReactElement} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

/**
 * Renders a chat group list item for use in a chat group list.
 *
 * @param {object} group - The chat group schema.
 * @param {string} group.name - The name of the chat group.
 *
 * @return {ReactElement} The rendered chat group list item.
 */
export default function ChatGroupListItem({group}: {group: ChatGroupSchema}): ReactElement {
    const router = useRouter()

    return (
        <Pressable style={styles.container} onPress={() => router.push("/chat-groups/" + group.id)}>
            <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text>{group.description}</Text>
            </View>

            <Ionicons name="chevron-forward" size={24} color="black" />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
        gap: 20
    },

    groupInfo: {
        flex: 1
    },

    groupName: {
        fontSize: 16,
        fontWeight: "bold"
    },
})