"use client";

import { useState, useEffect } from "react";
import { createMatter } from "@/actions/createMatter";
import { fetchAllMatters } from "@/actions/fetchAllMatters";
import { changeMatterState } from "@/actions/changeState";
import { deleteMatter } from "@/actions/changeState";
import { countMattersByState } from "@/actions/calculate";

export default function CreateAndDisplayMatters() {
    const [name, setName] = useState("");
    const [matters, setMatters] = useState([]);
    const [stateCounts, setStateCounts] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch all matters and state counts on component mount
    useEffect(() => {
        async function getMatters() {
            try {
                const result = await fetchAllMatters();
                setMatters(result.matters);

                const counts = await countMattersByState();
                setStateCounts(counts.counts);
            } catch (error) {
                console.error("Error fetching matters or counts:", error);
                setErrorMessage("Failed to load matters or counts.");
            }
        }

        getMatters();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");
        setLoading(true);

        try {
            // Call the server function directly
            const result = await createMatter({ name });
            setSuccessMessage(result.message);
            setName(""); // Clear the form after successful creation

            // Fetch updated matters list and state counts
            const updatedMatters = await fetchAllMatters();
            setMatters(updatedMatters.matters);

            const updatedCounts = await countMattersByState();
            setStateCounts(updatedCounts.counts);
        } catch (error) {
            console.error("Error creating matter:", error);
            setErrorMessage(error.message || "Failed to create matter");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeState = async (id, newState) => {
        try {
            const result = await changeMatterState({ id, newState });
            setSuccessMessage(result.message);

            // Fetch updated matters list and state counts
            const updatedMatters = await fetchAllMatters();
            setMatters(updatedMatters.matters);

            const updatedCounts = await countMattersByState();
            setStateCounts(updatedCounts.counts);
        } catch (error) {
            console.error("Error changing matter state:", error);
            setErrorMessage(error.message || "Failed to change state");
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await deleteMatter({ id });
            setSuccessMessage(result.message);

            // Fetch updated matters list and state counts
            const updatedMatters = await fetchAllMatters();
            setMatters(updatedMatters.matters);

            const updatedCounts = await countMattersByState();
            setStateCounts(updatedCounts.counts);
        } catch (error) {
            console.error("Error deleting matter:", error);
            setErrorMessage(error.message || "Failed to delete matter");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Create and Display Matters</h1>

            {/* Form to create a matter */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div>
                    <label htmlFor="name" className="block text-gray-600 font-medium mb-2">
                        Matter Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter matter name"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 text-white font-semibold rounded-lg ${loading
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Matter"}
                </button>
            </form>

            {successMessage && (
                <p className="mt-4 text-green-600 font-medium">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="mt-4 text-red-600 font-medium">{errorMessage}</p>
            )}

            {/* Display state counts */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Matter Counts</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border rounded-md shadow-md bg-gray-50 text-center">
                        <p className="text-lg font-bold">Gas</p>
                        <p className="text-2xl text-blue-500">{stateCounts.Gas || 0}</p>
                    </div>
                    <div className="p-4 border rounded-md shadow-md bg-gray-50 text-center">
                        <p className="text-lg font-bold">Liquid</p>
                        <p className="text-2xl text-blue-500">{stateCounts.Liquid || 0}</p>
                    </div>
                    <div className="p-4 border rounded-md shadow-md bg-gray-50 text-center">
                        <p className="text-lg font-bold">Solid</p>
                        <p className="text-2xl text-blue-500">{stateCounts.Solid || 0}</p>
                    </div>
                </div>
            </div>

            {/* Display all matters */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">All Matters</h2>
                {matters.length > 0 ? (
                    <ul className="space-y-4">
                        {matters.map((matter) => (
                            <li
                                key={matter._id}
                                className="p-4 border rounded-md shadow-md bg-gray-50 flex justify-between items-center"
                            >
                                <div>
                                    <span className="font-medium text-gray-700">{matter.name}</span>
                                    <span className="ml-4 text-sm text-gray-500 italic">{matter.state}</span>
                                </div>
                                <div className="flex space-x-4">
                                    {matter.state !== "Solid" && (
                                        <select
                                            className="p-2 border rounded-md"
                                            onChange={(e) => handleChangeState(matter._id, e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Change State</option>
                                            <option value="Gas">Gas</option>
                                            <option value="Liquid">Liquid</option>
                                            <option value="Solid">Solid</option>
                                        </select>
                                    )}
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
                                        onClick={() => handleDelete(matter._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No matters found.</p>
                )}
            </div>
        </div>
    );
}
