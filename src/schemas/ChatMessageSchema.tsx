/**
 * Schema that helps improve data integrity when communicating with Firestore.
 */
interface ChatMessageSchema {
    id: string
    contents: string
    mediaType: string
    senderName: string
    senderAvatar: string
    senderId: string
    createdAt?: Date
}

export default ChatMessageSchema