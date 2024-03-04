import {FirebaseFirestoreTypes} from "@react-native-firebase/firestore";
import ChatMessageSchema from "../schemas/ChatMessageSchema";

/**
 * Converts a Firestore document to a ChatMessageSchema object.
 *
 * @param {FirebaseFirestoreTypes.QueryDocumentSnapshot} doc - The Firestore document to convert.
 * @returns {ChatMessageSchema} - The converted ChatMessageSchema object.
 */
export default function firestoreDocumentToChatMessage(doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): ChatMessageSchema {
    const message = doc.data()

    return {
        ...message,
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate()
    } as ChatMessageSchema
}