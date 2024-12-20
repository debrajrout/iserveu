"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { createUser } from "../actions/createUser"

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser || null);
      setLoading(false); // Stop loading when auth state is checked
    });
    return () => unsubscribe();
  }, []);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in successfully:", result.user);
      const { email, uid: firebaseId, displayName, photoURL } = result.user;

      // Create or update user in MongoDB
      await createUser({ email, firebaseId, name: displayName, image: photoURL });

      setInfoMessage(`Logged in successfully: ${displayName}`);
      setErrorMessage("");
      setUser(result.user); // Update user state
    } catch (error) {
      console.error("Error signing in:", error);
      setErrorMessage("Failed to sign in with Google: " + error.message);
      setInfoMessage("");
    }
  };

  // Handle Sign-Out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null); // Clear user state
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center text-center">
      {/* Logo and Welcome Message */}
      <div className="mb-8">
        {/* <Image
          src="/logo.png" // Replace with your app logo
          alt="App Logo"
          width={120}
          height={120}
          className="mx-auto"
        /> */}
        <h1 className="text-5xl font-extrabold text-gray-800 mt-6">
          Welcome to <span className="text-blue-600">iServiue</span>
        </h1>
        <p className="text-xl text-gray-700 mt-4">
          Your ultimate platform for managing Matters seamlessly.
        </p>
      </div>

      {/* Login or User Info Section */}
      <div className="max-w-4xl bg-white shadow-lg rounded-lg p-10 text-gray-800">
        {!loading && !user ? (
          <>
            {/* Login Button */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg text-lg font-semibold shadow-lg transform transition-transform hover:scale-105"
              onClick={handleGoogleSignIn}
            >
              Login with Google
            </Button>
          </>
        ) : loading ? (
          // Loading State Placeholder
          <p className="text-lg text-gray-600">Checking authentication status...</p>
        ) : (
          // Logged-in User Info
          <div className="text-center">
            <Image
              src={user.photoURL || "/dummy-profile.png"}
              alt="User Profile"
              className="rounded-full mx-auto mb-4 ring-2 ring-gray-700"
              width={80}
              height={80}
            />
            <h2 className="text-2xl font-bold text-gray-800">Hello, {user.displayName}!</h2>
            <p className="text-gray-600 mt-2">{user.email}</p>
            <Button
              className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-lg text-lg font-semibold shadow-lg transform transition-transform hover:scale-105"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        )}

        {/* Display Messages */}
        {infoMessage && <p className="mt-4 text-green-500">{infoMessage}</p>}
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-gray-500 text-sm">
        &copy; 2024 <span className="font-semibold text-blue-600">iServiue</span>. All rights reserved.
      </footer>
    </div>
  );
}
