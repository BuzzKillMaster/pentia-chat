import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

admin.initializeApp()

/**
 * Updates the lastMessageAt field of the chat group when a new message is created.
 */
exports.onMessageCreated = functions.firestore
    .document("chat-groups/{groupId}/messages/{messageId}")
    .onCreate(async (_, context) => {
        await admin.firestore()
            .doc("chat-groups/" + context.params.groupId)
            .update({
                lastMessageAt: admin.firestore.FieldValue.serverTimestamp()
            })
    })