import { useState } from "react";

interface UseAdminProps {
    refreshClasses: () => Promise<void>;
}

export function useAdmin({ refreshClasses }: UseAdminProps) {
    const [className, setClassName] = useState("");
    const [totalSeats, setTotalSeats] = useState("");
    const [creating, setCreating] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleCreateClass = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        const name = className.trim();
        const seats = Number(totalSeats);

        if (!name) {
            setErrorMessage("Please enter a class name")
            return;
        }

        if (!Number.isInteger(seats) || seats <= 0) {
            setErrorMessage("Total seats must be a positive whole number")
            return;
        }

        setCreating(true);

        try {
            const response = await fetch("http://localhost:8080/classes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    totalSeats: seats,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || errorData?.message || "Could not create the class. Please try again.");
            }

            await refreshClasses();

            setSuccessMessage(`${name} created successfully`);
            setClassName("");
            setTotalSeats("");
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Something went wrong while creating the class"
            );
        } finally {
            setCreating(false);
        }
    };

    return {
        className,
        setClassName,
        totalSeats,
        creating,
        successMessage,
        errorMessage,
        handleCreateClass,
    }
}