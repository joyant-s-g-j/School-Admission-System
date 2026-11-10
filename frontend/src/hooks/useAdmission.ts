import { useCallback, useEffect, useRef, useState } from "react";
import type { SchoolClass, StudentHold } from "../types";

interface UseAdmissionProps {
  classes: SchoolClass[];
  refreshClasses: () => Promise<void>;
}

export function useAdmission({
  classes,
  refreshClasses,
}: UseAdmissionProps) {
  const [studentId, setStudentIdState] = useState("");
  const [applyingClassId, setApplyingClassId] = useState<string | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");

  const [myApplications, setMyApplications] = useState<StudentHold[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const [currentTime, setCurrentTime] = useState<number>(0);

  const requestId = useRef(0);

  const autoRefreshInProgress = useRef(false);

  const isValidStudentId = /^[0-9]{17}$/.test(studentId);

  useEffect(() => {
    const updateTime = () => {
        setCurrentTime(Date.now())
    }
    updateTime();

    const timer = setInterval(updateTime, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const fetchMyApplications = useCallback(async (id: string) => {
    if (!/^[0-9]{17}$/.test(id)) {
      setMyApplications([]);
      setApplicationsLoading(false);
      return;
    }

    const currentRequest = ++requestId.current;

    setApplicationsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/me/holds", {
        headers: {
          "X-Student-Id": id,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data: StudentHold[] = await response.json();

      if (currentRequest === requestId.current) {
        setMyApplications(data);
      }
    } catch (err) {
      if (currentRequest === requestId.current) {
        console.error("Could not load applications:", err);
        setMyApplications([]);
      }
    } finally {
      if (currentRequest === requestId.current) {
        setApplicationsLoading(false);
      }
    }
  }, []);

  const updateStudentId = useCallback(
    (id: string) => {
      setStudentIdState(id);
      setApplicationMessage("");
      setApplicationError("");

      if (/^[0-9]{17}$/.test(id)) {
        void fetchMyApplications(id);
      } else {
        requestId.current++;
        setMyApplications([]);
        setApplicationsLoading(false);
      }
    },
    [fetchMyApplications]
  );

  const handleApply = useCallback(
    async (classId: string) => {
      if (!/^[0-9]{17}$/.test(studentId)) {
        setApplicationError("Please enter a valid 17-digit Student ID.");
        setApplicationMessage("");
        return;
      }

      const selectedClass = classes.find(
        (schoolClass) => schoolClass.id === classId
      );

      if (!selectedClass || selectedClass.availableSeats <= 0) {
        setApplicationError("No available seats in this class.");
        setApplicationMessage("");
        return;
      }

      setApplyingClassId(classId);
      setApplicationError("");
      setApplicationMessage("");

      try {
        const response = await fetch(
          `http://localhost:8080/classes/${classId}/holds`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Student-Id": studentId,
            },
          }
        );

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Failed to apply for admission.");
        }

        setApplicationMessage("Your seat has been held successfully!");

        await refreshClasses();
        await fetchMyApplications(studentId);
      } catch (err) {
        setApplicationError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setApplyingClassId(null);
      }
    },
    [studentId, classes, refreshClasses, fetchMyApplications]
  );

  const getRemainingTime = useCallback((expiresAt: string) => {
    const expiryTime = new Date(expiresAt).getTime();
    const remaining = Number.isNaN(expiryTime)
        ? 0
        : Math.max(0, expiryTime - currentTime);

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000)

    return {
        remaining,
        formatted: `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`,
    };
  },
  [currentTime]
 )

 useEffect(() => {
    if (!isValidStudentId) {
      return;
    }

    const timer = setInterval(() => {
      const hasExpiredHold = myApplications.some(
        (application) =>
          application.status === "HELD" &&
          new Date(application.expiresAt).getTime() <= Date.now()
      );

      if (!hasExpiredHold || autoRefreshInProgress.current) {
        return;
      }

      autoRefreshInProgress.current = true;

      void Promise.all([
        fetchMyApplications(studentId),
        refreshClasses(),
      ]).finally(() => {
        autoRefreshInProgress.current = false;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [
    isValidStudentId,
    studentId,
    myApplications,
    fetchMyApplications,
    refreshClasses,
  ]);

  return {
    studentId,
    updateStudentId,
    isValidStudentId,
    applyingClassId,
    applicationMessage,
    applicationError,
    myApplications,
    applicationsLoading,
    handleApply,
    getRemainingTime
  };
}