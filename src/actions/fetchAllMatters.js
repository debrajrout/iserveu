"use server";

import dbConnect from "@/lib/dbConnect";
import Matter from "@/models/Matter";

export async function fetchAllMatters() {
    await dbConnect();

    try {

        const matters = await Matter.find({});
        return { message: "Matters fetched successfully", matters };
    } catch (error) {
        console.error("Error fetching matters:", error);
        throw new Error("Internal server error");
    }
}
