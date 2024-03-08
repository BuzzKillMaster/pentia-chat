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

        // TODO: Have someone skilled at RegEx review this. I mean, what even is this? 😂
        const isURL = message?.contents?.match(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/)

        await admin.messaging().send({
            topic: context.params.groupId,
            notification: {
                title: message?.senderName || "New Message",
                body: isURL ? "Sent an attachment" : message?.contents || "New Message",
            },
            data: {
                groupId: context.params.groupId,
                groupName: (await ref.get()).get("name")
            }
        })
    })