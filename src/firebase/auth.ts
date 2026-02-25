'use client';

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { initializeFirebase } from '.';

export function signInWithGoogle() {
  const { auth } = initializeFirebase();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).catch((error) => {
    console.error("Error signing in with Google: ", error);
  });
}

export function signOutWithGoogle() {
  const { auth } = initializeFirebase();
  signOut(auth).catch((error) => {
    console.error("Error signing out: ", error);
  });
}
