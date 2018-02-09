"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.removeOldMessages = functions.https.onRequest((request, response) => {
    const CUT_OFF = 10 * 24 * 60 * 60 * 1000; //10 Days
    const reference = admin.database().ref('/chat');
    const cutoff = Date.now() - CUT_OFF;
    const oldMessages = reference.orderByChild('time').endAt(cutoff);
    var messages = 0;
    return oldMessages.once('value').then((snapshot) => {
        const updates = {};
        snapshot.forEach((child) => {
            messages += 1;
            updates[child.key] = null;
        });
        console.log("Messages Deleted: " + messages);
        response.status(200).send();
        return reference.update(updates);
    });
});
//# sourceMappingURL=index.js.map