import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AssetStatCardProps {
  category: string
  amount: number
  currency: string
  accountCount: number
  icon: string
  color: string
}

export default function AssetStatCard({
  category,
  amount,
  currency,
  accountCount,
  icon,
  color
}: AssetStatCardProps) {
  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount)
    return amount < 0 ? `-${absAmount.toLocaleString()}` : absAmount.toLocaleString()
  }

  const getAmountColor = (amount: number) => {
    if (amount < 0) return 'text-red-600'
    if (amount > 0) return 'text-green-600'
    return 'text-gray-600'
  }

  return (
    <Card className={`${color} hover:shadow-md transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-medium">{category}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className={`text-xl font-bold ${getAmountColor(amount)}`}>
          {formatAmount(amount)}원
        </div>
        <div className="text-sm text-muted-foreground">
          {accountCount}개 계좌
        </div>
        
        {/* 진행률 바 (총 자산 대비 비율) */}
        {amount > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>비중</span>
              <span>{((amount / 93920000) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all" 
                style={{ width: `${Math.min((amount / 93920000) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}