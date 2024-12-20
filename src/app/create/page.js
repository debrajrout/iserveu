"use client"

import CreateMatter from '@/components/create';
import React, { useEffect } from 'react';
import { deleteNonSolidMatters } from '@/actions/changeState';

export default function Page() {
    useEffect(() => {
        async function cleanUpMatters() {
            try {
                await deleteNonSolidMatters();
                console.log("Non-solid matters cleaned up on reload.");
            } catch (error) {
                console.error("Error cleaning up non-solid matters:", error);
            }
        }

        cleanUpMatters();
    }, []);

    return (
        <div><CreateMatter /></div>
    );
}
