import React from 'react'

const dashboardIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
)

const practiceIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5">
    <path d="M8 6h8M8 10h5M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M15 16l-3-1.5V12l3-1.5V16z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)

const historyIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5">
    <path d="M12 8v4l2.5 2.5M3.05 11a9 9 0 1 0 .5-3M3 4v4h4"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const resumeIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const analyticsIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5">
    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M7 16l4-4 4 4 4-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const themeIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
)

const NavItem = ({ children, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
      active
        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-medium'
        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
    }`}
  >
    <span className={`shrink-0 ${active ? 'text-teal-600 dark:text-teal-400' : 'text-stone-400 dark:text-stone-500'}`}>
      {icon}
    </span>
    <span>{children}</span>
  </button>
)

const MobileNavItem = ({ children, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 flex-1 py-2 text-xs transition ${
      active ? 'text-teal-600 dark:text-teal-400' : 'text-stone-500 dark:text-stone-400'
    }`}
  >
    <span className={`${active ? 'text-teal-600 dark:text-teal-400' : 'text-stone-400 dark:text-stone-500'}`}>
      {icon}
    </span>
    <span>{children}</span>
  </button>
)

export default function Sidebar({ onToggleTheme, onNavigate, currentPage = 'dashboard' }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-56 hidden md:flex flex-col gap-2 py-5 px-3 bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800">
        {/* Logo */}
        <div className="px-3 mb-3">
          <span className="text-base font-semibold tracking-tight text-stone-800 dark:text-stone-100">MockMate</span>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5">
          <NavItem icon={dashboardIcon} active={currentPage === 'dashboard'} onClick={() => onNavigate?.('dashboard')}>
            Dashboard
          </NavItem>
          <NavItem icon={practiceIcon} active={currentPage === 'interview'} onClick={() => onNavigate?.('interview')}>
            Practice
          </NavItem>
          <NavItem icon={resumeIcon} active={currentPage === 'resume'} onClick={() => onNavigate?.('resume')}>
            Resume
          </NavItem>
          <NavItem icon={historyIcon} active={currentPage === 'history'} onClick={() => onNavigate?.('history')}>
            History
          </NavItem>
          <NavItem icon={analyticsIcon} active={currentPage === 'analytics'} onClick={() => onNavigate?.('analytics')}>
            Analytics
          </NavItem>
        </nav>

        <div className="border-t border-stone-100 dark:border-stone-800 pt-3 mt-1">
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-stone-500 dark:text-stone-400
                       hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            {themeIcon}
            Toggle theme
          </button>
          <p className="text-[10px] text-stone-300 dark:text-stone-700 px-3 mt-2">© 2026 Tushar Sharma</p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex items-center px-2">
        <MobileNavItem icon={dashboardIcon} active={currentPage === 'dashboard'} onClick={() => onNavigate?.('dashboard')}>
          Home
        </MobileNavItem>
        <MobileNavItem icon={practiceIcon} active={currentPage === 'interview'} onClick={() => onNavigate?.('interview')}>
          Practice
        </MobileNavItem>
        <MobileNavItem icon={resumeIcon} active={currentPage === 'resume'} onClick={() => onNavigate?.('resume')}>
          Resume
        </MobileNavItem>
        <MobileNavItem icon={analyticsIcon} active={currentPage === 'analytics'} onClick={() => onNavigate?.('analytics')}>
          Analytics
        </MobileNavItem>
        <MobileNavItem icon={themeIcon} onClick={onToggleTheme}>
          Theme
        </MobileNavItem>
      </nav>
    </>
  )
}
