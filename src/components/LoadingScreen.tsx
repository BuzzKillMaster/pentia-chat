import {ActivityIndicator, StyleSheet, View} from "react-native";
import {ReactElement} from "react";

/**
 * Renders a full screen loading component intended to sit on top of the main application content.
 *
 * @returns {ReactElement} The loading screen component.
 */
export default function LoadingScreen(): ReactElement {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={"#f0f"} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 10,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
})