import React from 'react'

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

export default function Sidebar({ onToggleTheme, onNavigate, currentPage = 'dashboard' }) {
  return (
    <aside className="w-64 hidden md:flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
      <div className="text-lg font-semibold">MockMate</div>
      <nav className="flex-1 flex flex-col gap-2">
        <NavItem 
          icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" stroke="currentColor" strokeWidth="1.2"/></svg>} 
          active={currentPage === 'dashboard'}
          onClick={() => onNavigate?.('dashboard')}
        >
          Dashboard
        </NavItem>
        <NavItem 
          icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>}
          active={currentPage === 'interview'}
          onClick={() => onNavigate?.('interview')}
        >
          Practice
        </NavItem>
        <NavItem icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.2"/></svg>}>
          Settings
        </NavItem>
      </nav>
      <div className="mt-2">
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.2"/></svg>
          Toggle Theme
        </button>
      </div>
    </aside>
  )
}
