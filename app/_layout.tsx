import {Slot} from "expo-router";
import SessionProvider from "../src/providers/SessionProvider";
import {ReactElement} from "react";

/**
 * Renders the root layout of the application.
 *
 * @return {ReactElement} - The rendered root layout.
 */
export default function RootLayout(): ReactElement {
    return (
        <SessionProvider>
            <Slot />
        </SessionProvider>
    )
}