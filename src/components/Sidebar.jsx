import React from 'react'

const dashboardIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)

const practiceIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3" stroke="currentColor" strokeWidth="1.2" fill="none"/>
  </svg>
)

const historyIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M12 8v4l2.5 2.5M3.05 11a9 9 0 1 0 .5-3M3 4v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const resumeIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const settingsIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)

const themeIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)

const NavItem = ({ children, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
      active ? 'bg-gray-100 dark:bg-gray-800 font-medium' : 'text-gray-700 dark:text-gray-200'
    }`}
  >
    <span className="w-5 h-5 text-gray-500 dark:text-gray-300">{icon}</span>
    <span>{children}</span>
  </button>
)

const MobileNavItem = ({ children, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 flex-1 py-2 text-xs transition ${
      active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
    }`}
  >
    <span className={`w-5 h-5 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
      {icon}
    </span>
    <span>{children}</span>
  </button>
)

export default function Sidebar({ onToggleTheme, onNavigate, currentPage = 'dashboard' }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 hidden md:flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
        <div className="text-lg font-semibold">MockMate</div>
        <nav className="flex-1 flex flex-col gap-2">
          <NavItem
            icon={dashboardIcon}
            active={currentPage === 'dashboard'}
            onClick={() => onNavigate?.('dashboard')}
          >
            Dashboard
          </NavItem>
          <NavItem
            icon={practiceIcon}
            active={currentPage === 'interview'}
            onClick={() => onNavigate?.('interview')}
          >
            Practice
          </NavItem>
          <NavItem
            icon={resumeIcon}
            active={currentPage === 'resume'}
            onClick={() => onNavigate?.('resume')}
          >
            Resume
          </NavItem>
          <NavItem
            icon={historyIcon}
            active={currentPage === 'history'}
            onClick={() => onNavigate?.('history')}
          >
            History
          </NavItem>
          <NavItem icon={settingsIcon}>
            Settings
          </NavItem>
        </nav>
        <div className="mt-2">
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
          >
            {themeIcon}
            Toggle Theme
          </button>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center px-2">
        <MobileNavItem
          icon={dashboardIcon}
          active={currentPage === 'dashboard'}
          onClick={() => onNavigate?.('dashboard')}
        >
          Dashboard
        </MobileNavItem>
        <MobileNavItem
          icon={practiceIcon}
          active={currentPage === 'interview'}
          onClick={() => onNavigate?.('interview')}
        >
          Practice
        </MobileNavItem>
        <MobileNavItem
          icon={resumeIcon}
          active={currentPage === 'resume'}
          onClick={() => onNavigate?.('resume')}
        >
          Resume
        </MobileNavItem>
        <MobileNavItem
          icon={historyIcon}
          active={currentPage === 'history'}
          onClick={() => onNavigate?.('history')}
        >
          History
        </MobileNavItem>
        <MobileNavItem icon={themeIcon} onClick={onToggleTheme}>
          Theme
        </MobileNavItem>
      </nav>
    </>
  )
}
