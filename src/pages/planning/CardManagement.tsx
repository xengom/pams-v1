import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, CreditCard, TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react'
import type { Card as CardType, CardUsage } from '@/types'

export default function CardManagement() {
  const [showForm, setShowForm] = useState(false)
  
  // TODO: 실제 데이터는 API에서 가져오기
  const mockCards: CardType[] = [
    {
      id: '1',
      name: '삼성카드 플래티넘',
      type: 'credit',
      issuer: '삼성카드',
      lastFourDigits: '1234',
      creditLimit: 5000000,
      isActive: true,
      color: '#1E40AF',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: '국민카드 올댓쇼핑',
      type: 'credit',
      issuer: '국민카드',
      lastFourDigits: '5678',
      creditLimit: 3000000,
      isActive: true,
      color: '#059669',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: '토스뱅크 체크카드',
      type: 'debit',
      issuer: '토스뱅크',
      lastFourDigits: '9012',
      linkedAccountId: 'acc-1',
      isActive: true,
      color: '#DC2626',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]

  const mockUsage: CardUsage[] = [
    // 이번달
    { id: '1', cardId: '1', year: 2024, month: 12, totalAmount: 850000, transactionCount: 23, calculatedAt: '2024-12-01T00:00:00Z' },
    { id: '2', cardId: '2', year: 2024, month: 12, totalAmount: 320000, transactionCount: 12, calculatedAt: '2024-12-01T00:00:00Z' },
    { id: '3', cardId: '3', year: 2024, month: 12, totalAmount: 180000, transactionCount: 8, calculatedAt: '2024-12-01T00:00:00Z' },
    // 저번달
    { id: '4', cardId: '1', year: 2024, month: 11, totalAmount: 720000, transactionCount: 19, calculatedAt: '2024-11-01T00:00:00Z' },
    { id: '5', cardId: '2', year: 2024, month: 11, totalAmount: 280000, transactionCount: 10, calculatedAt: '2024-11-01T00:00:00Z' },
    { id: '6', cardId: '3', year: 2024, month: 11, totalAmount: 150000, transactionCount: 6, calculatedAt: '2024-11-01T00:00:00Z' }
  ]

  const currentMonth = mockUsage.filter(u => u.month === 12)
  const previousMonth = mockUsage.filter(u => u.month === 11)

  const totalThisMonth = currentMonth.reduce((sum, usage) => sum + usage.totalAmount, 0)
  const totalLastMonth = previousMonth.reduce((sum, usage) => sum + usage.totalAmount, 0)
  const changePercent = totalLastMonth > 0 ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 : 0

  const getCardUsage = (cardId: string, month: number) => {
    return mockUsage.find(u => u.cardId === cardId && u.month === month)
  }

  const getUsageRate = (card: CardType) => {
    if (card.type === 'debit' || !card.creditLimit) return null
    const thisMonthUsage = getCardUsage(card.id, 12)
    if (!thisMonthUsage) return 0
    return (thisMonthUsage.totalAmount / card.creditLimit) * 100
  }

  const handleAddCard = () => {
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">카드 관리</h1>
        <p className="text-muted-foreground">
          신용카드와 체크카드의 사용 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* 카드 사용 요약 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">등록된 카드</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCards.filter(c => c.isActive).length}개
            </div>
            <p className="text-xs text-muted-foreground">
              신용카드 {mockCards.filter(c => c.type === 'credit').length}개, 체크카드 {mockCards.filter(c => c.type === 'debit').length}개
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번달 사용액</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalThisMonth.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">
              {currentMonth.reduce((sum, usage) => sum + usage.transactionCount, 0)}건 거래
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">저번달 사용액</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalLastMonth.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">
              {previousMonth.reduce((sum, usage) => sum + usage.transactionCount, 0)}건 거래
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전월 대비</CardTitle>
            {changePercent > 0 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${changePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {changePercent > 0 ? '증가' : '감소'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 카드 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>카드 목록</CardTitle>
            <button
              onClick={handleAddCard}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>카드 추가</span>
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {mockCards.map((card) => {
              const thisMonthUsage = getCardUsage(card.id, 12)
              const lastMonthUsage = getCardUsage(card.id, 11)
              const usageRate = getUsageRate(card)
              
              return (
                <div
                  key={card.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: card.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{card.name}</h3>
                      <p className="text-sm text-gray-600">
                        {card.issuer} • **** {card.lastFourDigits}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                        card.type === 'credit' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {card.type === 'credit' ? '신용카드' : '체크카드'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>이번달 사용액</span>
                      <span className="font-medium">
                        {thisMonthUsage?.totalAmount.toLocaleString() || 0}원
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>저번달 사용액</span>
                      <span className="font-medium">
                        {lastMonthUsage?.totalAmount.toLocaleString() || 0}원
                      </span>
                    </div>

                    {card.type === 'credit' && card.creditLimit && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>신용한도</span>
                          <span className="font-medium">
                            {card.creditLimit.toLocaleString()}원
                          </span>
                        </div>
                        {usageRate !== null && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>사용률</span>
                              <span>{usageRate.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  usageRate > 80 ? 'bg-red-500' : 
                                  usageRate > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(usageRate, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 월별 사용 추이 차트 (추후 구현) */}
      <Card>
        <CardHeader>
          <CardTitle>월별 사용 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            카드별 월간 사용 추이 차트 (추후 구현 예정)
          </div>
        </CardContent>
      </Card>

      {/* 카드 추가 폼 (추후 구현) */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>새 카드 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              카드 추가 폼 (추후 구현 예정)
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}