import React from 'react'
import type { SchoolClass } from '../../types'

interface ClassCardProps {
    schoolClass: SchoolClass;
}

const ClassCard = ({schoolClass}: ClassCardProps) => {
  const availabilityPercentage =
    schoolClass.totalSeats > 0
      ? (schoolClass.availableSeats / schoolClass.totalSeats) * 100
      : 0;

  const isAvailable = schoolClass.availableSeats > 0;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
        <div className='flex items-start justify-between gap-3'>
            <div>
                <h4 className='font-bold text-slate-900'>
                    {schoolClass.name}
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                    Class admission
                </p>
            </div>

            <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isAvailable
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
            >
                {isAvailable ? "Available" : "Full"}
            </span>
        </div>

        <div className='mt-6 rounded-xl bg-slate-50 p-4'>
            <div className='flex items-end justify-between'>
                <div>
                    <p className='text-xs font-medium text-slate-900'>
                        Available Seats
                    </p>
                    <p className='mt-1 text-3xl font-bold text-slate-900'>
                        {schoolClass.availableSeats}
                    </p>
                </div>
                <p className='text-xs text-slate-500'>
                    out of {schoolClass.totalSeats}
                </p>
            </div>

            <div className='mt-3 h-2 overflow-hidden rounded-full bg-slate-200'>
                <div
                    className={`h-full rounded-full transition-all ${
                        availabilityPercentage > 30
                            ? "bg-green-500"
                            : availabilityPercentage > 0
                            ? "bg-amber-500"
                            : "bg-red-500"
                    }`}
                    style={{
                        width: `${Math.max(
                            0,
                            Math.min(100, availabilityPercentage)
                        )}%`,
                    }}
                />
            </div>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200">
            <div className="px-2 first:pl-0">
                <p className="text-xs text-slate-500">Total</p>
                <p className="mt-1 font-bold text-slate-800">
                    {schoolClass.totalSeats}
                </p>
            </div>

            <div className="px-3">
                <p className="text-xs text-slate-500">Held</p>
                <p className="mt-1 font-bold text-amber-600">
                    {schoolClass.heldSeats}
                </p>
            </div>

            <div className="px-3">
                <p className="text-xs text-slate-500">Confirmed</p>
                <p className="mt-1 font-bold text-blue-600">
                    {schoolClass.confirmedSeats}
                </p>
            </div>
        </div>

        <button
            type="button"
            disabled
            className="mt-6 w-full cursor-not-allowed rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400"
            title="Application functionality will be added next"
        >
            Apply for Admission
        </button>
    </div>
  )
}

export default ClassCard