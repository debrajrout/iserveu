"use server";

import dbConnect from "@/lib/dbConnect";
import Matter from "@/models/Matter";

// Function to calculate the number of matters in each state
export async function countMattersByState() {
    await dbConnect();

    try {
        // Aggregate the count of matters by state
        const counts = await Matter.aggregate([
            {
                $group: {
                    _id: "$state",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Format the result into a readable object
        const result = counts.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
        }, {});

        return {
            message: "Counts fetched successfully",
            counts: result,
        };
    } catch (error) {
        console.error("Error fetching matter counts by state:", error);
        throw new Error("Internal server error");
    }
}
