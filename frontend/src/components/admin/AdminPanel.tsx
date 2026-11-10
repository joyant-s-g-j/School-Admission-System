interface AdminPanelProps {
    className: string;
    setClassName: (value: string) => void;
    totalSeats: string;
    setTotalSeats: (value: string) => void;
    creating: boolean;
    successMessage: string;
    errorMessage: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function AdminPanel({
    className,
    setClassName,
    totalSeats,
    setTotalSeats,
    creating,
    successMessage,
    errorMessage,
    onSubmit,
}: AdminPanelProps) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-600">
                Administration
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
                Create a Class
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                Add a class with its shift and available seat capacity.
            </p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
                <label
                    htmlFor="className"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Class Name & Shift
                </label>

                <input
                    id="className"
                    type="text"
                    value={className}
                    onChange={(event) => setClassName(event.target.value)}
                    placeholder="e.g. Class 6 - Morning"
                    maxLength={100}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div>
                <label
                    htmlFor="totalSeats"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Total Seats
                </label>

                <input
                    id="totalSeats"
                    type="number"
                    min="1"
                    step="1"
                    value={totalSeats}
                    onChange={(event) => setTotalSeats(event.target.value)}
                    placeholder="e.g. 50"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div className="sm:col-span-2">
                <button
                    type="submit"
                    disabled={creating}
                    className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {creating ? "Creating..." : "Create Class"}
                </button>
            </div>
        </form>

        {successMessage && (
            <p
                role="status"
                className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
            >
                {successMessage}
            </p>
        )}

        {errorMessage && (
            <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
                {errorMessage}
            </p>
        )}
    </section>
  )
}

export default AdminPanel