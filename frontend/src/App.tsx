import { AdminPanel, ClassList, Footer, MyApplications, Navbar, StudentInformation } from "./components";
import { useClasses } from "./hooks/useClasses";
import { useAdmission } from "./hooks/useAdmission";
import { useAdmin } from "./hooks/useAdmin";
import { useState } from "react";

function App() {
  const [currentScreen, setCurrentScreen] = useState<"student" | "admin">("student");
  const { classes, loading, error, refreshClasses } = useClasses();
  const {
    studentId,
    updateStudentId,
    isValidStudentId,
    applyingClassId,
    applicationMessage,
    applicationError,
    myApplications,
    applicationsLoading,
    handleApply,
    getRemainingTime,
    handlePayment,
    handleCancel,
    processingHoldId,
  } = useAdmission({ classes, refreshClasses })
  const {
    className,
    setClassName,
    totalSeats,
    setTotalSeats,
    creating,
    successMessage,
    errorMessage,
    handleCreateClass,
  } = useAdmin({ refreshClasses });

  const toggleScreen = () => {
    setCurrentScreen((previous) => previous === "student" ? "admin" : "student")
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-500">
      <Navbar 
        currentScreen={currentScreen}
        onToggle={toggleScreen}
      />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
            Welcome to the admission portal
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            School Admission System
          </h2>

        </div>

        {currentScreen === "student" ? (
          <>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <StudentInformation 
                studentId={studentId}
                setStudentId={updateStudentId}
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
            <MyApplications 
                applications={myApplications}
                classes={classes}
                loading={applicationsLoading}
                isValidStudentId={isValidStudentId}
                getRemainingTime={getRemainingTime}
                handlePayment={handlePayment}
                handleCancel={handleCancel}
                processingHoldId={processingHoldId}
              />
          </>
        ) : (
          <AdminPanel 
            className={className}
            setClassName={setClassName}
            totalSeats={totalSeats}
            setTotalSeats={setTotalSeats}
            creating={creating}
            successMessage={successMessage}
            errorMessage={errorMessage}
            onSubmit={handleCreateClass}
          />
        )}

        <Footer />
      </main>
    </div>
  )
}

export default App