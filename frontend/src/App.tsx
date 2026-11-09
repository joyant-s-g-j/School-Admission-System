import { useState } from "react";
import { ClassList, Navbar, StudentInformation } from "./components";
import { useClasses } from "./hooks/useClasses";

function App() {
  const { classes, loading, error } = useClasses();
  const [studentId, setStudentId] = useState("");
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
          />
        </div>
      </main>
    </div>
  )
}

export default App