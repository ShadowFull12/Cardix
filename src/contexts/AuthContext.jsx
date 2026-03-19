"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...userDoc.data(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signup(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    const username = displayName.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);
    await setDoc(doc(db, "users", result.user.uid), {
      uid: result.user.uid,
      email,
      displayName,
      username,
      photoURL: null,
      bio: "",
      role: "user",
      plan: "free",
      onboardingComplete: false,
      template: "default",
      identityMode: "personal",
      publicData: {
        name: displayName,
        bio: "",
        role: "",
        socialLinks: {},
        portfolioLinks: [],
        contactButtons: { email: true, phone: false, whatsapp: false },
      },
      privateData: {
        phones: [],
        emails: [email],
        address: "",
        notes: "",
        paymentInfo: "",
        hiddenLinks: [],
      },
      settings: {
        profileVisibility: "public",
        theme: "dark",
        template: "default",
      },
      savedUsers: [],
      recentlyViewed: [],
      scanHistory: [],
      analytics: { views: 0, scans: 0, linkClicks: 0 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return result;
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      const username = result.user.displayName.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        username,
        photoURL: result.user.photoURL,
        bio: "",
        role: "user",
        onboardingComplete: false,
        template: "default",
        identityMode: "personal",
        publicData: {
          name: result.user.displayName,
          bio: "",
          role: "",
          socialLinks: {},
          portfolioLinks: [],
          contactButtons: { email: true, phone: false, whatsapp: false },
        },
        privateData: {
          phones: [],
          emails: [result.user.email],
          address: "",
          notes: "",
          paymentInfo: "",
          hiddenLinks: [],
        },
        settings: {
          profileVisibility: "public",
          theme: "dark",
          template: "default",
        },
        savedUsers: [],
        recentlyViewed: [],
        scanHistory: [],
        analytics: { views: 0, scans: 0, linkClicks: 0 },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return result;
  }

  async function logout() {
    return signOut(auth);
  }

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
