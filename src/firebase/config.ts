import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  "projectId": "studio-6701340122-57846",
  "appId": "1:998299932486:web:045a9588dd5b96136c7747",
  "apiKey": "AIzaSyDRUPRjlD4nNdolgHGoxOp6Z7aKnE2aqlM",
  "authDomain": "studio-6701340122-57846.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "998299932486"
};

// This initializes Firebase if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// This is the "db" export your other files are looking for!
export const db = getFirestore(app);