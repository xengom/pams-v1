import React from 'react'
import { Plus } from 'lucide-react'

const Accounts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">계정 관리</h2>
          <p className="text-gray-600 mt-2">은행 계좌, 카드, 투자 계좌를 관리하세요</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>계정 추가</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">은행 계좌</h3>
          <p className="text-gray-600 mt-2">0개 계좌</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">신용 카드</h3>
          <p className="text-gray-600 mt-2">0개 카드</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">투자 계좌</h3>
          <p className="text-gray-600 mt-2">0개 계좌</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">전체 계정 목록</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            아직 등록된 계정이 없습니다. 첫 번째 계정을 추가해보세요.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accounts