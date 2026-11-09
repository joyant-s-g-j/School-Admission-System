import { useEffect, useState } from "react";
import type { SchoolClass } from "../types";

export function useClasses() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:8080/classes")

        if (!response.ok) {
          throw new Error("Faild to fetch classes");
        }

        const data: SchoolClass[] = await response.json();
        setClasses(data);
      } catch {
        setError("Could not load classes.")
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [])

  return { classes, loading, error}
}