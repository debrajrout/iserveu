import { getApps, getApp, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createUser } from '@/actions/createUser';

const firebaseConfig = {
    apiKey: "AIzaSyCApv0OMsRMnkh-hjh1DPuaXLa1nSaMURc",
    authDomain: "iserveu-fbeba.firebaseapp.com",
    projectId: "iserveu-fbeba",
    storageBucket: "iserveu-fbeba.firebasestorage.app",
    messagingSenderId: "780698923784",
    appId: "1:780698923784:web:a3cf4997b7ddd2446af2bd",
    measurementId: "G-CFDB2EBFDC"
};

// Initialize Firebase only if no app is initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };

// Function for Google Sign-In
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log('Logged in successfully:', user);
        const { email, uid: firebaseId } = user;
        const response = await createUser(email, firebaseId);
        console.log(response.message);
        return user;
    } catch (error) {
        console.error('Error during Google sign-in:', error);
        throw error;
    }
};
