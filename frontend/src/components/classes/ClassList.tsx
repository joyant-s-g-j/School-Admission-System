import React from 'react'
import type { SchoolClass } from '../../types'
import ClassCard from './ClassCard';

interface ClassListProps {
    classes: SchoolClass[];
    loading: boolean;
    error: string;
    isValidStudentId: boolean;
    applyingClassId: string | null;
    applicationMessage: string;
    applicationError: string;
    onApply: (classId: string) => void;
}

const ClassList = ({
    classes,
    loading,
    error,
    isValidStudentId,
    applyingClassId,
    applicationMessage,
    applicationError,
    onApply,
}: ClassListProps) => {
  return (
    <section className='lg:col-span-2'>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h3 className="text-xl font-bold text-slate-900">
                    Available Classes
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Explore classes and check seat availability.
                </p>
            </div>

            {!loading && !error && (
                <span>
                    {classes.length} Classes Available
                </span>
            )}
        </div>

        {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <p className="mt-4 text-sm text-slate-500">
                    Loading available classes...
                </p>
            </div>
        )}

        {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="font-semibold text-red-700">
                    Something went wrong
                </p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
        )}

        {applicationMessage && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {applicationMessage}
            </div>
        )}

        {applicationError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {applicationError}
            </div>
        )}

        {!loading && !error && classes.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <svg
                        className="h-7 w-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.7"
                        d="M12 6v12m-6-6h12"
                    />
                    </svg>
                </div>

                <h4 className="mt-4 font-semibold text-slate-800">
                    No classes available
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                    Please check again later.
                </p>
            </div>
        )}

        {!loading && !error && classes.length > 0 && (
            <div className='grid md:grid-cols-2 gap-2'>
                {classes.map((schoolClass) => (
                    <ClassCard
                        key={schoolClass.id}
                        schoolClass={schoolClass}
                        isValidStudentId={isValidStudentId}
                        isApplying={applyingClassId === schoolClass.id}
                        onApply={onApply}
                    />
                ))}
            </div>
        )}
    </section>
  )
}

export default ClassList