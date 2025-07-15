
"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useAuth } from "./use-auth";
import { db } from "@/lib/firebase";

export interface UserData {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  credly?: string;
  facebook?: string;
  instagram?: string;
  kickresume?: string;
  whatsapp?: string;
  createdAt: any;
  updatedAt: any;
}

export function useUser() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setUserData(null);
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data() as UserData);
      } else {
        // If no document, create one from auth details
        const [firstName, lastName] = user.displayName?.split(" ") || ["", ""];
        const newUser: UserData = {
          uid: user.uid,
          email: user.email || "",
          firstName: firstName || "",
          lastName: lastName || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userDocRef, newUser, { merge: true });
        setUserData(newUser);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingUser(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const updateUserProfile = async (data: Partial<Omit<UserData, 'uid' | 'email' | 'createdAt'>>) => {
    if (!user) throw new Error("User not authenticated");

    const userDocRef = doc(db, "users", user.uid);
    const newDisplayName = `${data.firstName} ${data.lastName}`.trim();

    // Update Firebase Auth profile
    await updateProfile(user, {
      displayName: newDisplayName,
    });
    
    // Update Firestore document
    const dataToUpdate = {
      ...data,
      displayName: newDisplayName,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(userDocRef, dataToUpdate);
    
    // Optimistically update local state
    setUserData(prev => prev ? { ...prev, ...dataToUpdate } : null);
  };

  return { userData, loadingUser, updateUserProfile };
}

    