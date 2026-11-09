
interface StudentInformationProps {
  studentId: string;
  setStudentId: (value: string) => void;
}

export default function StudentInformation({
  studentId,
  setStudentId,
}: StudentInformationProps) {
  const isValidStudentId = /^[0-9]{17}$/.test(studentId);

  return (
    <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
      <div className="mb-6">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-slate-600">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21v-2a6 6 0 0112 0v2M19 8v6m3-3h-6"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          Student Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Provide your identification details.
        </p>
      </div>

      <div>
        <label
          htmlFor="studentId"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Birth Registration Number
        </label>

        <input
          id="studentId"
          type="text"
          inputMode="numeric"
          placeholder="Enter 17-digit number"
          value={studentId}
          maxLength={17}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*$/.test(value)) {
              setStudentId(value);
            }
          }}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Must contain exactly 17 digits.
          </p>

          <p className="text-xs font-medium text-slate-500">
            {studentId.length}/17
          </p>
        </div>

        {studentId.length === 17 && (
          <div
            className={`mt-3 rounded-lg px-3 py-2 text-sm ${
              isValidStudentId
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {isValidStudentId
              ? "Student ID format is valid."
              : "Invalid Student ID."}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl bg-blue-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          Important Information
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-700">
          Please enter your correct Birth Registration Number.
          It will be used to identify your admission applications.
        </p>
      </div>
    </section>
  );
}
