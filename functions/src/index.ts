import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onCall } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

// ✅ Global function settings
setGlobalOptions({
  region: "africa-south1",
  maxInstances: 10,
  memory: "256MiB",
  timeoutSeconds: 30
});

// ✅ Simple HTTP endpoint for health check
export const helloWorld = onRequest((req, res) => {
  logger.info("Request received", { method: req.method, path: req.path });
  res.status(200).send("Hello from Firebase in Africa South 1!");
});

// ✅ Example callable function (for use in client-side apps)
export const echo = onCall((request) => {
  const message = request.data.message;
  logger.info("Echo called", { message });
  return { echoed: message };
});

// ✅ Firestore trigger (e.g., user registered)
export const onNewUser = onDocumentCreated("users/{userId}", (event) => {
  const newUser = event.data?.fields;
  logger.info("New user registered", { uid: event.params.userId, newUser });
});
