interface NavbarProps {
    currentScreen: "student" | "admin";
    onToggle: () => void;
}

const Navbar = ({ currentScreen, onToggle }: NavbarProps) => {
  const isStudent = currentScreen === "student";
  return (
    <nav className='border-b border-slate-200 bg-white'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-xl bg-slate-700 text-lg font-bold text-white'>
                    S
                </div>
                <div>
                    <h1 className='text-lg font-bold tracking-tight text-slate-900'>School Admission</h1>
                    <p className='text-xs text-slate-500'>Admission Management System</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span
                    className={`text-sm font-semibold transition ${
                        isStudent ? "text-slate-900" : "text-slate-400"
                    }`}
                >
                    Student
                </span>

                <button
                    type="button"
                    role="switch"
                    aria-checked={!isStudent}
                    aria-label="Switch between Student and Admin"
                    onClick={onToggle}
                    className={`relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-colors duration-300 ${
                        isStudent ? "bg-slate-300" : "bg-slate-700"
                    }`}
                >
                    <span
                        className={`inline-block size-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                            isStudent ? "translate-x-1" : "translate-x-6"
                        }`}
                    />
                </button>

                <span
                    className={`text-sm font-semibold transition ${
                        !isStudent ? "text-slate-900" : "text-slate-400"
                    }`}
                >
                    Admin
                </span>
            </div>
        </div>
    </nav>
  )
}

export default Navbar