"use server";
import mongoose from "mongoose";
import User from "../models/User";

// Helper function to connect to MongoDB
async function connectToDatabase() {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Connected to MongoDB successfully!");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw new Error("Database connection failed");
        }
    }
}

// Function to handle user creation
export async function createUser({ email, firebaseId, name = "", image = "" }) {
    await connectToDatabase();

    try {
        // Check if the user already exists by Firebase ID
        const existingUser = await User.findOne({ firebaseId });
        if (existingUser) {
            return { message: "User already exists" };
        }

        // Create a new user document
        const newUser = new User({
            email,
            firebaseId,
            name,
            image,
            matters: [], // Initialize with an empty array
        });

        // Save the new user
        await newUser.save();

        return { message: "User created successfully", user: newUser };
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Internal server error");
    }
}
