"use server";

import mongoose from "mongoose";
import Matter from "@/models/Matter";
import dbConnect from "../lib/dbConnect";

export async function createMatter({ name }) {
    await dbConnect();

    try {

        const newMatter = new Matter({
            name,
            state: "Gas",
        });


        await newMatter.save();

        return { message: "Matter created successfully", matter: newMatter };
    } catch (error) {
        console.error("Error creating matter:", error);
        throw new Error("Internal server error");
    }
}
