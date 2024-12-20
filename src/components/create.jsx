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
            const result = await createMatter({ name });
            setSuccessMessage(result.message);
            setName("");

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
        <div className="max-w-screen-lg mx-auto p-10">
            <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-700">Matter Management</h1>

            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add a New Matter</h2>
                <form onSubmit={handleSubmit} className="flex gap-4 flex-col md:flex-row items-center">
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter matter name"
                        className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
                        required
                    />
                    <button
                        type="submit"
                        className={`px-6 py-3 text-white font-bold rounded-lg ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </form>
                {successMessage && <p className="mt-4 text-green-500 font-medium">{successMessage}</p>}
                {errorMessage && <p className="mt-4 text-red-500 font-medium">{errorMessage}</p>}
            </div>

            <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(stateCounts).map(([state, count]) => (
                    <div
                        key={state}
                        className="bg-indigo-100 text-center p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <p className="text-xl font-bold capitalize text-indigo-700">{state}</p>
                        <p className="text-4xl font-extrabold text-indigo-800 mt-2">{count}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Matters</h2>
                {matters.length > 0 ? (
                    <ul className="space-y-4">
                        {matters.map((matter) => (
                            <li
                                key={matter._id}
                                className="p-4 bg-gray-50 border-l-4 border-indigo-600 rounded-lg shadow flex justify-between items-center hover:shadow-lg hover:bg-gray-100 transition-all"
                            >
                                <div>
                                    <p className="font-medium text-gray-700">{matter.name}</p>
                                    <p className="text-sm text-gray-500 italic">State: {matter.state}</p>
                                </div>
                                <div className="flex gap-4">
                                    {matter.state !== "Solid" && (
                                        <select
                                            className="p-2 border rounded-lg focus:ring focus:ring-indigo-500"
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
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
