import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AssetStatCard from '@/components/assets/AssetStatCard'

export default function AssetOverview() {
  // TODO: 실제 데이터는 API에서 가져오기
  const assetStats = [
    {
      category: '입출금계좌',
      amount: 15420000,
      currency: 'KRW',
      accountCount: 3,
      icon: '🏦',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      category: '저축',
      amount: 25000000,
      currency: 'KRW',
      accountCount: 2,
      icon: '💰',
      color: 'bg-green-50 border-green-200'
    },
    {
      category: '투자',
      amount: 45000000,
      currency: 'KRW',
      accountCount: 5,
      icon: '📈',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      category: '연금',
      amount: 8500000,
      currency: 'KRW',
      accountCount: 1,
      icon: '🏡',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      category: '부채',
      amount: -12000000,
      currency: 'KRW',
      accountCount: 2,
      icon: '💳',
      color: 'bg-red-50 border-red-200'
    }
  ]

  const totalAssets = assetStats.reduce((sum, stat) => sum + (stat.amount > 0 ? stat.amount : 0), 0)
  const totalDebt = assetStats.reduce((sum, stat) => sum + (stat.amount < 0 ? Math.abs(stat.amount) : 0), 0)
  const netWorth = totalAssets - totalDebt

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">자산현황</h1>
        <p className="text-muted-foreground">
          모든 계좌의 자산 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* 총 자산 요약 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 자산</CardTitle>
            <span className="text-2xl">💎</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalAssets.toLocaleString()}원
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 부채</CardTitle>
            <span className="text-2xl">💸</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalDebt.toLocaleString()}원
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">순자산</CardTitle>
            <span className="text-2xl">⚖️</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {netWorth.toLocaleString()}원
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 카테고리별 자산 현황 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">카테고리별 현황</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assetStats.map((stat) => (
            <AssetStatCard key={stat.category} {...stat} />
          ))}
        </div>
      </div>

      {/* 자산 분포 차트 영역 (추후 구현) */}
      <Card>
        <CardHeader>
          <CardTitle>자산 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            차트 영역 (추후 Recharts로 구현 예정)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}