import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">대시보드</h2>
        <p className="text-gray-600 mt-2">전체 자산 현황을 한눈에 확인하세요</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">총 자산</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">₩0</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">총 수익</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">₩0</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">수익률</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">0%</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">배당금</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">₩0</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">차트 영역</h3>
        <div className="h-96 flex items-center justify-center text-gray-500">
          차트가 여기에 표시됩니다
        </div>
      </div>
    </div>
  )
}

export default Dashboard