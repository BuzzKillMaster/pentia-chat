import {ReactElement, useEffect} from "react";
import {Image, Pressable, StyleSheet, View} from "react-native";
import {useNavigation} from "expo-router";

interface LightBoxComponentProps {
    imageUrl: string
    setImage: (imageUrl: string | null) => void
}

/**
 * LightBoxComponent renders a component that displays an image in a lightbox view with an overlay.
 *
 * @param {string} imageUrl - The URL of the image to be displayed.
 * @param {function} setImage - The function to set the image to null when the lightbox is closed.
 *
 * @returns {ReactElement} - The LightBoxComponent element.
 */
export default function LightBoxComponent({imageUrl, setImage}: LightBoxComponentProps): ReactElement {
    const navigation = useNavigation()

    useEffect(() => {
        const handleBeforeRemove = (e: any) => {
            if (imageUrl) {
                e.preventDefault()
                setImage(null)
            }
        }

        navigation.addListener("beforeRemove", handleBeforeRemove)

        return () => {
            navigation.removeListener("beforeRemove", handleBeforeRemove)
        }
    }, [])

    return (
        <Pressable style={{
            ...styles.absoluteFill,
            ...styles.container,
        }} onPress={() => setImage(null)}>
            <View style={{
                ...styles.absoluteFill,
                ...styles.overlay
            }}></View>

            <Image
                source={{uri: imageUrl}}
                style={styles.image}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    absoluteFill: {
        position: "absolute",

        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        zIndex: 100,
    },

    overlay: {
        backgroundColor: "#000",
        opacity: 0.75,
    },

    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    }
})
