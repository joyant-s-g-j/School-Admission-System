import React from 'react'

const Navbar = () => {
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

                <span className='rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-slate-700'>
                    Student Portal
                </span>
            </div>
        </div>
    </nav>
  )
}

export default Navbar