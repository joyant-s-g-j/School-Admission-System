import React, { type isValidElement } from 'react'
import type { SchoolClass, StudentHold } from '../../types'

interface MyApplicationsProps {
    applications: StudentHold[];
    classes: SchoolClass[];
    loading: boolean;
    isValidStudentId: boolean;
    getRemainingTime: (expiresAt: string) => {
        remaining: number;
        formatted: string;
    };
    handlePayment: (holdId: string) => void;
    handleCancel: (holdId: string) => void;
    processingHoldId: string | null;
}

const MyApplications = ({
    applications,
    classes,
    loading,
    isValidStudentId,
    getRemainingTime,
    handlePayment,
    handleCancel,
    processingHoldId,
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => {
                const selectedClass = classes.find(
                    (schoolClass) => schoolClass.id === application.classId
                );

                const remainingTime = getRemainingTime(application.expiresAt)

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

                        {application.status === "HELD" && (
                            <div className='mt-4 rouned-xl bg-amber-50 p-4'>
                                <p className='text-xs font-medium text-amber-700'>
                                    Time remaining
                                </p>
                                <p className='mt-1 text-2xl font-bold tabular-nums text-amber-700'>
                                    {remainingTime.formatted}
                                </p>

                                {remainingTime.remaining === 0 ? (
                                    <p className='mt-1 text-xs text-red-600'>
                                        Hold expired. Refreshing application status...
                                    </p>
                                ): (
                                    <p className="mt-1 text-xs text-amber-700">
                                        Time remaining to complete admission.
                                    </p>
                                )}
                            </div>
                        )}

                        {application.status === "HELD" &&
                            getRemainingTime(application.expiresAt).remaining > 0 && (
                                <button
                                    type="button"
                                    disabled={processingHoldId === application.id}
                                    onClick={() => handlePayment(application.id)}
                                    className="mt-4 w-full rounded-xl bg-green-600 cursor-pointer px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                {processingHoldId === application.id
                                    ? "Processing..."
                                    : "Pay Admission Fee"}
                                </button>
                            )
                        }

                        {application.status === "CONFIRMED" && (
                            <div className="mt-4 rounded-xl bg-green-50 p-3 text-center text-sm font-semibold text-green-700">
                                <span>✓ Admission Confirmed</span>
                            </div>
                        )}

                        {application.status === "HELD" &&
                            getRemainingTime(application.expiresAt).remaining > 0 && (
                                <button
                                    type="button"
                                    disabled={processingHoldId === application.id}
                                    onClick={() => handleCancel(application.id)}
                                    className="mt-2 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processingHoldId === application.id
                                        ? "Processing..."
                                        : "Cancel Application"}
                                </button>
                            )
                        }
                    </div>
                );
            })}
        </div>
      )}
    </section>
  )
}

export default MyApplications