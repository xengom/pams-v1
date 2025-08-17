import React from 'react'
import { Plus } from 'lucide-react'

const Transactions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">거래 내역</h2>
          <p className="text-gray-600 mt-2">모든 입출금 거래를 기록하고 관리하세요</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>거래 추가</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">최근 거래</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            아직 등록된 거래가 없습니다. 첫 번째 거래를 추가해보세요.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transactions