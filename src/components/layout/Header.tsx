import React from 'react'
import { Building2 } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">PAMS</h1>
          <span className="text-sm text-gray-500">Personal Asset Management System</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            환영합니다!
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header