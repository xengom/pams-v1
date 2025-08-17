import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Calendar, DollarSign, Edit2, Trash2 } from 'lucide-react'
import type { FixedExpense } from '@/types'

export default function FixedExpenses() {
  // TODO: 실제 데이터는 API에서 가져오기
  const [showForm, setShowForm] = useState(false)
  
  const mockAnnualExpenses: FixedExpense[] = [
    {
      id: '1',
      name: '자동차보험',
      category: '보험',
      amount: 600000,
      frequency: 'annual',
      startDate: '2024-01-01',
      isActive: true,
      description: '현대해상 자동차보험',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: '건강보험료',
      category: '보험',
      amount: 1200000,
      frequency: 'annual',
      startDate: '2024-01-01',
      isActive: true,
      description: '국민건강보험',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]

  const mockMonthlyExpenses: FixedExpense[] = [
    {
      id: '3',
      name: '월세',
      category: '주거',
      amount: 800000,
      frequency: 'monthly',
      startDate: '2024-01-01',
      isActive: true,
      description: '원룸 월세',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: '통신비',
      category: '통신',
      amount: 120000,
      frequency: 'monthly',
      startDate: '2024-01-01',
      isActive: true,
      description: '휴대폰 + 인터넷',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      name: 'Netflix 구독',
      category: '엔터테인먼트',
      amount: 17000,
      frequency: 'monthly',
      startDate: '2024-01-01',
      isActive: true,
      description: '프리미엄 플랜',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]

  const totalAnnual = mockAnnualExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalMonthly = mockMonthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyAverage = (totalAnnual / 12) + totalMonthly

  const handleAddExpense = () => {
    setShowForm(true)
  }

  const ExpenseTable = ({ expenses, title }: { expenses: FixedExpense[], title: string }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
          <button
            onClick={handleAddExpense}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>추가</span>
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">항목</th>
                <th className="text-left py-2 px-2">카테고리</th>
                <th className="text-right py-2 px-2">금액</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-center py-2 px-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{expense.name}</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    {expense.amount.toLocaleString()}원
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600">
                    {expense.description || '-'}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    등록된 고정비가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">고정비 관리</h1>
        <p className="text-muted-foreground">
          연간/월간 고정지출을 체계적으로 관리하세요
        </p>
      </div>

      {/* 고정비 요약 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">연간 고정지출</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalAnnual.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">
              {mockAnnualExpenses.length}개 항목
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">월간 고정지출</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalMonthly.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">
              {mockMonthlyExpenses.length}개 항목
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">월평균 고정비</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(monthlyAverage).toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">
              연간 고정비 포함
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 연간 고정지출 */}
      <ExpenseTable expenses={mockAnnualExpenses} title="연간 고정지출" />

      {/* 월간 고정지출 */}
      <ExpenseTable expenses={mockMonthlyExpenses} title="월간 고정지출" />

      {/* 고정비 추가 폼 (추후 구현) */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>새 고정비 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              고정비 추가 폼 (추후 구현 예정)
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}