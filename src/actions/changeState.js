// "use server";

// import fs from "fs";
// import path from "path";
// import dbConnect from "@/lib/dbConnect";
// import Matter from "@/models/Matter";

// const solidMattersFilePath = path.join(process.cwd(), "solidMatters.json");

// // Function to change the state of a matter
// export async function changeMatterState({ id, newState }) {
//     await dbConnect();

//     try {
//         const matter = await Matter.findById(id);

//         if (!matter) {
//             throw new Error("Matter not found");
//         }

//         if (matter.state === "Solid") {
//             throw new Error("State cannot be changed as the matter is already frozen in Solid state");
//         }

//         matter.state = newState;

//         // If the state becomes Solid, save to file and freeze
//         if (newState === "Solid") {
//             saveMatterToFile(matter);
//         }

//         await matter.save();

//         return { message: "Matter state updated successfully", matter };
//     } catch (error) {
//         console.error("Error updating matter state:", error);
//         throw new Error("Internal server error");
//     }
// }

// // Function to save solid matter to a file
// function saveMatterToFile(matter) {
//     try {
//         const solidMatters = fs.existsSync(solidMattersFilePath)
//             ? JSON.parse(fs.readFileSync(solidMattersFilePath, "utf8"))
//             : [];

//         solidMatters.push({
//             id: matter._id,
//             name: matter.name,
//             state: matter.state,
//             createdAt: matter.createdAt,
//         });

//         fs.writeFileSync(solidMattersFilePath, JSON.stringify(solidMatters, null, 2));
//         console.log("Matter saved to solidMatters.json");
//     } catch (error) {
//         console.error("Error saving matter to file:", error);
//     }
// }

// // Function to delete a matter
// export async function deleteMatter({ id }) {
//     await dbConnect();

//     try {
//         const matter = await Matter.findById(id);

//         if (!matter) {
//             throw new Error("Matter not found");
//         }

//         if (matter.state === "Solid") {
//             throw new Error("Cannot delete matter as it is in Solid state and frozen");
//         }

//         await Matter.findByIdAndDelete(id);

//         return { message: "Matter deleted successfully" };
//     } catch (error) {
//         console.error("Error deleting matter:", error);
//         throw new Error(error.message || "Internal server error");
//     }
// }


// export async function deleteNonSolidMatters() {
//     await dbConnect();

//     try {
//         await Matter.deleteMany({ state: { $ne: "Solid" } });
//         console.log("Non-solid matters deleted successfully");
//         return { message: "Non-solid matters deleted successfully" };
//     } catch (error) {
//         console.error("Error deleting non-solid matters:", error);
//         throw new Error("Internal server error");
//     }
// }





"use server";

import fs from "fs";
import path from "path";
import dbConnect from "@/lib/dbConnect";
import Matter from "@/models/Matter";

const solidMattersFilePath = path.join(process.cwd(), "solidMatters.json");
const localMattersFilePath = path.join(process.cwd(), "localMatters.json");

// Function to change the state of a matter
export async function changeMatterState({ id, newState }) {
    await dbConnect();

    try {
        const matter = await Matter.findById(id);

        if (!matter) {
            throw new Error("Matter not found");
        }

        if (matter.state === "Solid") {
            throw new Error("State cannot be changed as the matter is already frozen in Solid state");
        }

        matter.state = newState;

        // If the state becomes Solid, save to file and freeze
        if (newState === "Solid") {
            saveMatterToFile(matter);
        }

        await matter.save();
        updateLocalMattersFile();

        return { message: "Matter state updated successfully", matter };
    } catch (error) {
        console.error("Error updating matter state:", error);
        throw new Error("Internal server error");
    }
}

// Function to save solid matter to a file
function saveMatterToFile(matter) {
    try {
        const solidMatters = fs.existsSync(solidMattersFilePath)
            ? JSON.parse(fs.readFileSync(solidMattersFilePath, "utf8"))
            : [];

        solidMatters.push({
            id: matter._id,
            name: matter.name,
            state: matter.state,
            createdAt: matter.createdAt,
        });

        fs.writeFileSync(solidMattersFilePath, JSON.stringify(solidMatters, null, 2));
        console.log("Matter saved to solidMatters.json");
    } catch (error) {
        console.error("Error saving matter to file:", error);
    }
}

// Function to update the local matters file
function updateLocalMattersFile() {
    try {
        dbConnect();
        Matter.find({}).then((matters) => {
            const localMatters = matters.map((matter) => ({
                id: matter._id,
                name: matter.name,
                state: matter.state,
                createdAt: matter.createdAt,
            }));

            fs.writeFileSync(localMattersFilePath, JSON.stringify(localMatters, null, 2));
            console.log("Local matters file updated successfully");
        });
    } catch (error) {
        console.error("Error updating local matters file:", error);
    }
}

// Function to delete a matter
export async function deleteMatter({ id }) {
    await dbConnect();

    try {
        const matter = await Matter.findById(id);

        if (!matter) {
            throw new Error("Matter not found");
        }

        if (matter.state === "Solid") {
            throw new Error("Cannot delete matter as it is in Solid state and frozen");
        }

        await Matter.findByIdAndDelete(id);
        updateLocalMattersFile();

        return { message: "Matter deleted successfully" };
    } catch (error) {
        console.error("Error deleting matter:", error);
        throw new Error(error.message || "Internal server error");
    }
}

// Function to delete all non-solid matters and update local file
export async function deleteNonSolidMatters() {
    await dbConnect();

    try {
        await Matter.deleteMany({ state: { $ne: "Solid" } });
        console.log("Non-solid matters deleted successfully");
        updateLocalMattersFile();
        return { message: "Non-solid matters deleted successfully" };
    } catch (error) {
        console.error("Error deleting non-solid matters:", error);
        throw new Error("Internal server error");
    }
}
