import {Alert, FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet} from 'react-native';
import {ReactElement, useContext, useEffect, useState} from "react";
import firestore from '@react-native-firebase/firestore';
import ChatGroupSchema from "../../src/schemas/ChatGroupSchema";
import ChatGroupListItem from "../../src/components/chat/ChatGroupListItem";
import {Stack} from "expo-router";
import {SessionContext} from "../../src/providers/SessionProvider";
import {Ionicons} from "@expo/vector-icons";
import {StatusBar} from "expo-status-bar";

/**
 * Render the home page of the application.
 * This is the default page that is shown when the app is opened,
 * as long as the user is authenticated.
 *
 * @returns {ReactElement} The rendered home page component.
 */
export default function HomePage(): ReactElement {
    const {signOut} = useContext(SessionContext)

    const [chatGroups, setChatGroups] = useState<ChatGroupSchema[]>([])
    const [isLoading, setIsLoading] = useState(false)

    /**
     * Refresh the chat groups list from the database.
     */
    const refreshChatGroups = () => {
        setIsLoading(true)
        const groups = firestore().collection("chat-groups").orderBy("lastMessageAt", "desc")

        groups.get().then(snapshot => {
            const documents = snapshot.docs.map(doc => {
                const group = doc.data() as ChatGroupSchema
                return {...group, id: doc.id}
            })

            setChatGroups(documents)
        }).catch(_ => {
            Alert.alert("Uh-oh!", "It looks like we're having trouble fetching your chat groups. Please try again later.")
        }).finally(
            () => setIsLoading(false)
        )
    }

    useEffect(() => {
        refreshChatGroups()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={"dark"} />

            <Stack.Screen options={{
                title: "Chat Groups",
                headerRight: () => {
                    return (
                        <Pressable onPress={signOut}>
                            <Ionicons name={"log-out-outline"} size={24} color={"#d6595e"} />
                        </Pressable>
                    )
                }
            }} />

            <FlatList
                data={chatGroups}
                renderItem={({item}) => <ChatGroupListItem group={item} />}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={refreshChatGroups}
                    />
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})