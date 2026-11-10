import { useCallback, useEffect, useState } from "react";
import type { SchoolClass } from "../types";

export function useClasses() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const refreshClasses = useCallback(async () => {
    try {
        const response = await fetch("http://localhost:8080/classes")

        if (!response.ok) {
          throw new Error("Faild to fetch classes");
        }

        const data: SchoolClass[] = await response.json();
        setClasses(data);
        setError("");
    } catch {
        setError("Could not load classes.")
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchClasses() {
        try {
            const response = await fetch("http://localhost:8080/classes");

            if (!response.ok) {
                throw new Error("Failed to fetch classes");
            }

            const data: SchoolClass[] = await response.json();

            if (!ignore) {
                setClasses(data);
                setError("");
            }
        } catch {
            if (!ignore) {
                setError("Could not load classes.");
            }
        } finally {
            if (!ignore) {
                setLoading(false);
            }
        }
        }

        fetchClasses();

        return () => {
            ignore = true;
        };
  }, []);
    

  return { classes, loading, error, refreshClasses}
}