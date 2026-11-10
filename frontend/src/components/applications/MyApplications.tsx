import React, { type isValidElement } from 'react'
import type { SchoolClass, StudentHold } from '../../types'

interface MyApplicationsProps {
    applications: StudentHold[];
    classes: SchoolClass[];
    loading: boolean;
    isValidStudentId: boolean;
}

const MyApplications = ({
    applications,
    classes,
    loading,
    isValidStudentId
}: MyApplicationsProps) => {
  const getStatusStyle = (status: StudentHold["status"]) => {
    switch (status) {
        case "HELD":
            return "bg-amber-50 text-amber-700";
        case "CONFIRMED":
        return "bg-green-50 text-green-700";

        case "EXPIRED":
            return "bg-red-50 text-red-700";

        case "CANCELLED":
            return "bg-slate-100 text-slate-600";

        default:
            return "bg-slate-100 text-slate-600";
    }
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) {
        return "Unavailable"
    }
    return parsedDate.toLocaleString();
  };

  return (
    <section className="mt-10">
        <div className="mb-5">
            <h3 className="text-xl font-bold text-slate-900">
                My Applications
            </h3>

            <p className="mt-1 text-sm text-slate-500">
                Track your admission applications.
            </p>
        </div>

        {!isValidStudentId ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                Enter a valid Student ID to view your applications.
            </div>
        ) : loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                Loading your applications...
            </div>
        ) : applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="font-semibold text-slate-800">
                    No applications found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    You haven't applied for any class yet.
                </p>
            </div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2">
            {applications.map((application) => {
                const selectedClass = classes.find(
                (schoolClass) =>
                    schoolClass.id === application.classId
                );

                return (
                    <div
                        key={application.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h4 className="font-bold text-slate-900">
                                    {selectedClass?.name ?? "School Class"}
                                </h4>

                                <p className="mt-1 text-xs text-slate-500">
                                    Admission Application
                                </p>
                            </div>

                            <span
                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                    application.status
                                )}`}
                            >
                                {application.status}
                            </span>
                        </div>

                        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                            <div className="flex flex-wrap justify-between gap-2">
                                <span className="text-slate-500">
                                    Application ID
                                </span>

                                <span className="break-all font-medium text-slate-700">
                                    {application.id}
                                </span>
                            </div>

                            <div className="flex justify-between gap-2">
                                <span className="text-slate-500">
                                    Applied
                                </span>

                                <span className="text-right font-medium text-slate-700">
                                    {formatDate(application.createdAt)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-2">
                                <span className="text-slate-500">
                                    Hold Expires
                                </span>

                                <span className="text-right font-medium text-slate-700">
                                    {formatDate(application.expiresAt)}
                                </span>
                            </div>

                            {application.confirmedAt && (
                                <div className="flex justify-between gap-2">
                                    <span className="text-slate-500">
                                        Confirmed
                                    </span>

                                    <span className="text-right font-medium text-green-700">
                                        {formatDate(application.confirmedAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      )}
    </section>
  )
}

export default MyApplications