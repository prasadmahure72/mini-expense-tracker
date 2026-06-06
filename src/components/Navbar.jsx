import { Menu, Sun, Moon, LogOut, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useLocation } from 'react-router-dom'

const titles = {
  '/dashboard': 'Dashboard',
  '/expenses': 'Expenses',
  '/expenses/new': 'Add Expense',
  '/profile': 'Profile',
}

export default function Navbar({ onMenuClick }) {
  const { logout, user } = useAuth()
  const { dark, toggle } = useTheme()
  const { pathname } = useLocation()

  const title = Object.entries(titles).findLast(([key]) => pathname.startsWith(key))?.[1] || 'ExpenseIQ'

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 md:px-6 gap-4 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h2 className="font-semibold text-gray-900 dark:text-white text-lg flex-1">{title}</h2>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          title="Toggle theme"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors relative">
          <Bell className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700 ml-1">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
            <span className="text-primary-700 dark:text-primary-400 font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
            {user?.name}
          </span>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
