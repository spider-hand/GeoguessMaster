import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

exports.deleteExpiredRooms = functions.pubsub
  .schedule("every wednesday 00:00")
  .onRun((context) => {
    const db = admin.database();

    // Delete all rooms 1 day has been passed since it was created
    return db.ref("/").once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.hasChild("createdAt")) {
          const createdAt = childSnapshot.child("createdAt").val();
          const currentDate = Date.now();
          const difference = currentDate - createdAt;

          if (difference > 86400000) {
            childSnapshot.ref
              .remove()
              .catch((err) => functions.logger.error(err));
          }
        } else {
          childSnapshot.ref
            .remove()
            .catch((err) => functions.logger.error(err));
        }
      });
    });
  });
