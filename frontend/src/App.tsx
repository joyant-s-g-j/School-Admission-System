import { useState } from "react";
import { ClassList, Footer, Navbar, StudentInformation } from "./components";
import { useClasses } from "./hooks/useClasses";

function App() {
  const { classes, loading, error, refreshClasses } = useClasses();
  const [studentId, setStudentId] = useState("");
  const [applyingClassId, setApplyingClassId] = useState<string | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");

  const isValidStudentId = /^[0-9]{17}$/.test(studentId);
  const handleApply = async (classId: string) => {
    if (!isValidStudentId) {
      setApplicationError(
        "Please enter a valid 17-digit Student ID."
      );
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

      // Refresh class seat counts
      await refreshClasses();
    } catch (err) {
      setApplicationError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setApplyingClassId(null);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-500">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
            Welcome to the admission portal
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            School Admission System
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Enter your birth registration number and explore available
            classes to apply for admission.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <StudentInformation 
            studentId={studentId}
            setStudentId={setStudentId}
          />
          <ClassList 
            classes={classes}
            loading={loading}
            error={error}
            isValidStudentId={isValidStudentId}
            applyingClassId={applyingClassId}
            applicationMessage={applicationMessage}
            applicationError={applicationError}
            onApply={handleApply}
          />
        </div>

        <Footer />
      </main>
    </div>
  )
}

export default App