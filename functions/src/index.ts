import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);


export const removeOldMessages = functions.https.onRequest((request, response) => {
  const CUT_OFF = 10 * 24 * 60 * 60 * 1000; //10 Days
  const reference = admin.database().ref('/chat');
  const cutoff = Date.now() - CUT_OFF;
  const oldMessages = reference.orderByChild('time').endAt(cutoff);
  let messages = 0;
  return oldMessages.once('value').then((snapshot) => {
    const updates = {};
    snapshot.forEach((child) => {
      messages +=1 ;
      updates[child.key] = null;
    });
    console.log("Messages Deleted: " + messages);
    response.status(200).send();
    return reference.update(updates);
  });
});

// Add subscription use case 1: New User implemented here. Use Case 2: Login on new device - is implemented on client side
export const addNewUser = functions.database.ref('/users/{userId}').onWrite(event => {
  const newTopic = event.params.userId; // UID = TOPIC
  const newToken = event.data.child('0').val(); //Location of child
  console.log("NewTopic" +newTopic + " NewTOKEN: " + newToken);
  const otherUsers = event.data.ref.parent;
  return otherUsers.once('value').then((snapshot) => {
    snapshot.forEach((child) =>{
      const topic = child.key;
      console.log("3:" + "Child key is " + child.key);
      if (child.key !== newTopic) {
        //subscribe new user to other topics
        admin.messaging().subscribeToTopic(newToken, topic).then((response) => {
          console.log("4:" + "Subscribed " + newToken + " to topic: " + topic);
        }).catch((e) => {
          console.log(e);
        });
        //subscribe device tokens to new topic
        console.log("5:" + typeof child + " " + typeof otherUsers);
        child.ref.once('value').then('value').then((snapshot2) => {
          snapshot2.forEach((child2) => {
            admin.messaging().subscribeToTopic(child2.val(), newTopic).then((response) => {
              console.log("6: Subscribed " + child2.val() + " to topic: " + newTopic);
            }).catch((e) => {
              console.log(e);
            });
          });
        });
      }
    });
    return;
  });
});

/* FCM/USER Database setup
/Blackburn
    /users
        /userId (userId = firebase auth id = topic when sending message)
            /token (token is unique to device, subscribe to other users)

*/

//Next function: send fcm message to auth id function
/*
export const sendNotification = functions.database.ref('/chat/{messageID}').onWrite(event => {
  const topic = event.data.val().id;
  const chatItem = event.data.val();
  const title = "New Message from " + chatItem.name;
  const message = chatItem.name + ": " + chatItem.message;
  return;
});
*/
