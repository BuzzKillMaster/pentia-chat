import {Redirect, Stack} from "expo-router";
import {ReactElement, useContext} from "react";
import {SessionContext} from "../../src/providers/SessionProvider";

/**
 * AppLayout component
 *
 * Checks if the user is authenticated.
 * If not, it redirects to the sign-in page.
 * Otherwise, it renders the Expo Router Stack.
 *
 * @returns {ReactElement} - The Expo Router Stack or a redirect to the sign-in page.
 */
export default function AppLayout(): ReactElement {
    const {user} = useContext(SessionContext)

    if (!user) return <Redirect href={"/sign-in"} />

    return <Stack />
}