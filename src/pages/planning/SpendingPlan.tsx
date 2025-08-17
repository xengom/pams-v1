import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, TrendingUp, Target, DollarSign, Edit3, Save, X } from 'lucide-react'
import type { SpendingPlan as SpendingPlanType } from '@/types'

export default function SpendingPlan() {
  const [currentDate, setCurrentDate] = useState({ year: 2024, month: 12 })
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // TODO: 실제 데이터는 API에서 가져오기
  const [spendingPlan, setSpendingPlan] = useState<SpendingPlanType>({
    id: '1',
    year: 2024,
    month: 12,
    fixedExpenses: 3300000, // 자동 계산 (고정비관리에서)
    savings: 1500000,
    investment: 800000,
    foodExpenses: 600000,
    transportation: 200000,
    utilities: 150000,
    entertainment: 300000,
    healthcare: 100000,
    education: 200000,
    miscellaneous: 250000,
    totalIncome: 5500000,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  })

  // Mock 실제 지출 데이터
  const actualExpenses = {
    fixedExpenses: 3300000, // 고정비는 실제와 동일
    savings: 1200000,
    investment: 900000,
    foodExpenses: 680000,
    transportation: 180000,
    utilities: 145000,
    entertainment: 420000,
    healthcare: 85000,
    education: 150000,
    miscellaneous: 320000
  }

  const categories = [
    { key: 'fixedExpenses', name: '고정비', icon: '🏠', isFixed: true },
    { key: 'savings', name: '저축', icon: '💰', isFixed: false },
    { key: 'investment', name: '투자', icon: '📈', isFixed: false },
    { key: 'foodExpenses', name: '식비', icon: '🍽️', isFixed: false },
    { key: 'transportation', name: '교통비', icon: '🚗', isFixed: false },
    { key: 'utilities', name: '공과금', icon: '💡', isFixed: false },
    { key: 'entertainment', name: '여가/엔터', icon: '🎬', isFixed: false },
    { key: 'healthcare', name: '의료비', icon: '🏥', isFixed: false },
    { key: 'education', name: '교육비', icon: '📚', isFixed: false },
    { key: 'miscellaneous', name: '기타', icon: '📦', isFixed: false }
  ]

  const totalPlanned = categories.reduce((sum, cat) => sum + spendingPlan[cat.key as keyof SpendingPlanType] as number, 0)
  const totalActual = Object.values(actualExpenses).reduce((sum, val) => sum + val, 0)
  const remaining = spendingPlan.totalIncome - totalPlanned

  const handleCellClick = (categoryKey: string) => {
    const category = categories.find(c => c.key === categoryKey)
    if (category?.isFixed) return // 고정비는 편집 불가
    
    setEditingCell(categoryKey)
    setEditValue(String(spendingPlan[categoryKey as keyof SpendingPlanType]))
  }

  const handleSave = () => {
    if (!editingCell) return
    
    const numValue = parseInt(editValue.replace(/,/g, '')) || 0
    setSpendingPlan(prev => ({
      ...prev,
      [editingCell]: numValue,
      updatedAt: new Date().toISOString()
    }))
    setEditingCell(null)
    setEditValue('')
  }

  const handleCancel = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + '원'
  }

  const getAchievementRate = (planned: number, actual: number) => {
    if (planned === 0) return 0
    return (actual / planned) * 100
  }

  const getAchievementColor = (rate: number) => {
    if (rate <= 80) return 'text-green-600'
    if (rate <= 100) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">지출계획 관리</h1>
        <p className="text-muted-foreground">
          카테고리별 예산을 계획하고 실제 지출과 비교하세요
        </p>
      </div>

      {/* 날짜 선택 및 요약 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 수입</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(spendingPlan.totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">계획 지출</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalPlanned)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">실제 지출</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalActual)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">잉여 자금</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(remaining)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Excel-like 예산 테이블 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {currentDate.year}년 {currentDate.month}월 예산 계획
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              💡 편집하려면 셀을 더블클릭하세요
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-medium">카테고리</th>
                  <th className="border border-gray-200 px-4 py-3 text-right font-medium">계획액</th>
                  <th className="border border-gray-200 px-4 py-3 text-right font-medium">실제액</th>
                  <th className="border border-gray-200 px-4 py-3 text-right font-medium">차이</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-medium">달성률</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const planned = spendingPlan[category.key as keyof SpendingPlanType] as number
                  const actual = actualExpenses[category.key as keyof typeof actualExpenses]
                  const difference = actual - planned
                  const achievementRate = getAchievementRate(planned, actual)
                  const isEditing = editingCell === category.key

                  return (
                    <tr key={category.key} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                          {category.isFixed && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              자동계산
                            </span>
                          )}
                        </div>
                      </td>
                      
                      {/* 계획액 셀 */}
                      <td 
                        className={`border border-gray-200 px-4 py-3 text-right ${
                          !category.isFixed ? 'cursor-pointer hover:bg-blue-50' : 'bg-gray-50'
                        }`}
                        onDoubleClick={() => !category.isFixed && handleCellClick(category.key)}
                      >
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-24 px-2 py-1 border rounded text-right"
                              autoFocus
                            />
                            <button
                              onClick={handleSave}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Save className="h-3 w-3" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-1">
                            <span className="font-mono">{formatCurrency(planned)}</span>
                            {!category.isFixed && (
                              <Edit3 className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        )}
                      </td>
                      
                      <td className="border border-gray-200 px-4 py-3 text-right font-mono">
                        {formatCurrency(actual)}
                      </td>
                      
                      <td className={`border border-gray-200 px-4 py-3 text-right font-mono ${
                        difference > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {difference > 0 ? '+' : ''}{formatCurrency(difference)}
                      </td>
                      
                      <td className={`border border-gray-200 px-4 py-3 text-center font-mono ${
                        getAchievementColor(achievementRate)
                      }`}>
                        {achievementRate.toFixed(1)}%
                      </td>
                      
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <div className={`w-3 h-3 rounded-full ${
                            achievementRate <= 80 ? 'bg-green-500' :
                            achievementRate <= 100 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
                
                {/* 합계 행 */}
                <tr className="bg-gray-100 font-semibold">
                  <td className="border border-gray-200 px-4 py-3">합계</td>
                  <td className="border border-gray-200 px-4 py-3 text-right font-mono">
                    {formatCurrency(totalPlanned)}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-right font-mono">
                    {formatCurrency(totalActual)}
                  </td>
                  <td className={`border border-gray-200 px-4 py-3 text-right font-mono ${
                    (totalActual - totalPlanned) > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {(totalActual - totalPlanned) > 0 ? '+' : ''}{formatCurrency(totalActual - totalPlanned)}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-center font-mono">
                    {getAchievementRate(totalPlanned, totalActual).toFixed(1)}%
                  </td>
                  <td className="border border-gray-200 px-4 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 월별 추이 차트 (추후 구현) */}
      <Card>
        <CardHeader>
          <CardTitle>예산 vs 실제 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            카테고리별 예산 vs 실제 비교 차트 (추후 구현 예정)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}