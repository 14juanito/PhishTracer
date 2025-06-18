import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForDevelopment",
  authDomain: "phishtracer-dev.firebaseapp.com",
  projectId: "phishtracer-dev",
  storageBucket: "phishtracer-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app; 