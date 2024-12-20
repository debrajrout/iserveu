
"use server";

import mongoose from "mongoose";
import Matter from "@/models/Matter";
import dbConnect from "../lib/dbConnect";
import fs from "fs";
import path from "path";

const localMattersFilePath = path.join(process.cwd(), "localMatters.json");

export async function createMatter({ name }) {
    await dbConnect();

    try {
        const newMatter = new Matter({
            name,
            state: "Gas",
        });

        // Save to the database
        await newMatter.save();

        // Save to the local file
        saveMatterToLocalFile(newMatter);

        return { message: "Matter created successfully", matter: newMatter };
    } catch (error) {
        console.error("Error creating matter:", error);
        throw new Error("Internal server error");
    }
}

// Function to save matter to a local file
function saveMatterToLocalFile(matter) {
    try {
        const localMatters = fs.existsSync(localMattersFilePath)
            ? JSON.parse(fs.readFileSync(localMattersFilePath, "utf8"))
            : [];

        localMatters.push({
            id: matter._id,
            name: matter.name,
            state: matter.state,
            createdAt: matter.createdAt,
        });

        fs.writeFileSync(localMattersFilePath, JSON.stringify(localMatters, null, 2));
        console.log("Matter saved to localMatters.json");
    } catch (error) {
        console.error("Error saving matter to local file:", error);
    }
}
