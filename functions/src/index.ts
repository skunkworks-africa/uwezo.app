import { setGlobalOptions } from "firebase-functions";
import { onRequest, onCall } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

// ✅ Global settings: region, concurrency, and resource limits
setGlobalOptions({
  region: "africa-south1",
  maxInstances: 10,
  memory: "256MiB",
  timeoutSeconds: 30
});

// ✅ HTTP Function — health check / basic ping
export const helloWorld = onRequest((req, res) => {
  logger.info("helloWorld called", { method: req.method, path: req.path });
  res.status(200).send("Hello from Firebase in Africa South 1!");
});

// ✅ Callable Function — useful for client-side Firebase SDK calls
export const echo = onCall((request) => {
  const { message } = request.data;
  logger.info("echo called", { message });

  if (typeof message !== "string") {
    throw new Error("Invalid input: message must be a string.");
  }

  return { echoed: message };
});

// ✅ Firestore Trigger — handle user creation in `/users/{userId}`
export const onNewUser = onDocumentCreated("users/{userId}", (event) => {
  const userId = event.params.userId;
  const newUser = event.data?.fields;

  if (!newUser) {
    logger.warn("User document missing data", { userId });
    return;
  }

  logger.info("New user registered", { userId, newUser });
});
