import React from 'react'
import { Plus } from 'lucide-react'

const Assets: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">자산 관리</h2>
          <p className="text-gray-600 mt-2">주식, ETF, 채권 등 투자 자산을 관리하세요</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>자산 추가</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">미국 주식</h3>
          <p className="text-gray-600 mt-2">0개 종목</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">한국 주식</h3>
          <p className="text-gray-600 mt-2">0개 종목</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">대체 투자</h3>
          <p className="text-gray-600 mt-2">0개 종목</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">채권</h3>
          <p className="text-gray-600 mt-2">0개 종목</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">보유 자산 목록</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            아직 등록된 자산이 없습니다. 첫 번째 자산을 추가해보세요.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Assets