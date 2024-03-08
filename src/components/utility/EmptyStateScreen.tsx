import {ReactElement} from "react";
import {View, Text, StyleSheet, Image} from "react-native";

interface EmptyStateScreenProps {
    image?: number
    title?: string
    message?: string
}

/**
 * Renders an empty state screen with optional image, title, and message properties.
 * It can technically render without any of these properties, but it's not recommended.
 *
 * @param {Object} EmptyStateScreenProps - The properties for the empty state screen.
 * @param {number | undefined} EmptyStateScreenProps.image - The image source as a require() statement.
 * @param {string | undefined} EmptyStateScreenProps.title - The title for the empty state screen.
 * @param {string | undefined} EmptyStateScreenProps.message - The message for the empty state screen.
 *
 * @return {ReactElement} - The rendered empty state screen.
 */
export default function EmptyStateScreen({image, title, message}: EmptyStateScreenProps): ReactElement {
    return (
        <View style={styles.container}>
            <Image source={image} style={{width: 200, height: 200}} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        gap: 16,
    },

    title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
    },

    message: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
    },
})