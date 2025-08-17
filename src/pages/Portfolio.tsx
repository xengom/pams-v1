import React from 'react'

const Portfolio: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">포트폴리오</h2>
        <p className="text-gray-600 mt-2">투자 성과와 분산 현황을 분석해보세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">자산별 분산</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            트리맵 차트가 여기에 표시됩니다
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">계정별 분산</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            트리맵 차트가 여기에 표시됩니다
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">성과 추이</h3>
        <div className="h-96 flex items-center justify-center text-gray-500">
          시계열 차트가 여기에 표시됩니다
        </div>
      </div>
    </div>
  )
}

export default Portfolio