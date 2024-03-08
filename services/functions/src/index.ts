import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

admin.initializeApp()

/**
 * Updates the lastMessageAt field of the chat group when a new message is created.
 */
exports.onMessageCreated = functions.firestore
    .document("chat-groups/{groupId}/messages/{messageId}")
    .onCreate(async (snapshot, context) => {
        const ref = admin.firestore().doc("chat-groups/" + context.params.groupId)

        await admin.firestore().doc("chat-groups/" + context.params.groupId).update({
            lastMessageAt: admin.firestore.FieldValue.serverTimestamp()
        })

        const message = snapshot.data()

        await admin.messaging().send({
            topic: context.params.groupId,
            notification: {
                title: message?.senderName || "New Message",
                // TODO: Find a better way to make this check, as it can be tricked, for example when users share a URL.
                body: message?.contents?.startsWith("http")  ? message?.contents || "New Message" : "Sent an image",
            },
            data: {
                groupId: context.params.groupId,
                groupName: (await ref.get()).get("name")
            }
        })
    })