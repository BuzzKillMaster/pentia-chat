/**
 * Schema that helps improve data integrity when communicating with Firestore.
 */
interface ChatMessageSchema {
    id: string
    contents: string
    sender: string
    createdAt?: Date
}