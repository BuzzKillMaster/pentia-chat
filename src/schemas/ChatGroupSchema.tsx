/**
 * Schema that helps improve data integrity when communicating with Firestore.
 */
interface ChatGroupSchema {
    id: string
    name: string
    description: string
}

export default ChatGroupSchema