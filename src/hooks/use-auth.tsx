"use client"; // This is a client component

import { useState, useEffect, useContext, createContext } from "react";
import {
  type Auth,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
 signInWithPopup,
  type User,
  UserCredential
} from 'firebase/auth';
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth as firebaseAuth } from '@/lib/firebase';
import { db as firestoreDb } from '@/lib/firebase'; // Renamed db to firestoreDb to avoid conflict

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

 return () => unsubscribe();
  }, []);

  const handleUserInFirestore = async (firebaseUser: User) => {
    const userDocRef = doc(firestoreDb, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    const displayName = firebaseUser.displayName || "";
    const nameParts = displayName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName,
        photoURL: firebaseUser.photoURL,
        firstName,
        lastName,
        role: "user",
        createdAt: serverTimestamp(), // You might already have a createdAt field. Remove if redundant.
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(userDocRef, {
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth as Auth, provider);
      await handleUserInFirestore(result.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signInWithGoogle,
    signOut,
  };

 return ( // Removed and re-typed JSX for clarity
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};