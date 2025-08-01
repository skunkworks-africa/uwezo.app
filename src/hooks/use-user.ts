
"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
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
  cvUrl?: string;
  createdAt: any;
  updatedAt: any;
}

export interface QuizAttempt {
    id: string;
    score: number;
    passed: boolean;
    timestamp: any;
}

export function useUser() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setUserData(null);
      setQuizAttempts([]);
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    try {
      // Fetch user document
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
      
      // Fetch quiz attempts
      const attemptsCollectionRef = collection(db, "users", user.uid, "quizAttempts");
      const q = query(attemptsCollectionRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const attempts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizAttempt));
      setQuizAttempts(attempts);

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
    
    let displayNameUpdate = {};
    if (data.firstName || data.lastName) {
        const currentFirstName = data.firstName || userData?.firstName || '';
        const currentLastName = data.lastName || userData?.lastName || '';
        const newDisplayName = `${currentFirstName} ${currentLastName}`.trim();
        displayNameUpdate = { displayName: newDisplayName };
        
        // Update Firebase Auth profile if displayName changes
        if (newDisplayName !== user.displayName) {
             await updateProfile(user, {
                displayName: newDisplayName,
            });
        }
    }

    // Update Firestore document
    const dataToUpdate = {
      ...data,
      ...displayNameUpdate,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(userDocRef, dataToUpdate);
    
    // Optimistically update local state
    setUserData(prev => prev ? { ...prev, ...dataToUpdate } : null);
  };
  
  const addQuizAttempt = async (attempt: { score: number, passed: boolean }) => {
      if (!user) throw new Error("User not authenticated");
      
      const attemptsCollectionRef = collection(db, "users", user.uid, "quizAttempts");
      const newAttempt = {
          ...attempt,
          timestamp: serverTimestamp()
      }
      await addDoc(attemptsCollectionRef, newAttempt);

      // Refresh quiz attempts data locally
      await fetchUserData();
  }

  return { userData, quizAttempts, loadingUser, updateUserProfile, addQuizAttempt };
}
