import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  TrendingUp, 
  PieChart,
  BarChart3,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '대시보드' },
  { path: '/accounts', icon: Wallet, label: '계정 관리' },
  { path: '/asset-overview', icon: BarChart3, label: '자산현황' },
  { path: '/planning', icon: Calendar, label: '계획 관리' },
  { path: '/transactions', icon: ArrowLeftRight, label: '거래 내역' },
  { path: '/assets', icon: TrendingUp, label: '자산 관리' },
  { path: '/portfolio', icon: PieChart, label: '포트폴리오' },
]

const Sidebar: React.FC = () => {
  const location = useLocation()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-80px)]">
      <nav className="p-4 space-y-2">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              location.pathname === path
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar