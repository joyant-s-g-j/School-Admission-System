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
    const intervalId = setInterval(() => {
        void refreshClasses()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [refreshClasses])
    

  return { classes, loading, error, refreshClasses}
}