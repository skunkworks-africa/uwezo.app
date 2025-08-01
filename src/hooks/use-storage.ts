
"use client";

import { useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import type { User } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (
    user: User,
    path: string,
    file: File,
    updateUserAvatar = false
  ): Promise<string | null> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      if (updateUserAvatar) {
        await updateProfile(user, { photoURL: downloadURL });
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { photoURL: downloadURL });
      }

      setIsUploading(false);
      return downloadURL;
    } catch (error: any) {
      setUploadError(error.message);
      setIsUploading(false);
      console.error("File upload error:", error);
      return null;
    }
  };

  const deleteFile = async (path: string): Promise<boolean> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return true;
    } catch (error: any) {
      console.error("File deletion error:", error);
      return false;
    }
  };

  return { isUploading, uploadError, uploadFile, deleteFile };
}
