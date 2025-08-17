import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, 
  CreditCard, 
  PieChart, 
  TrendingUp,
  ArrowRight 
} from 'lucide-react'

export default function PlanningDashboard() {
  // TODO: 실제 데이터는 API에서 가져오기
  const mockData = {
    fixedExpenses: {
      monthly: 2850000,
      annual: 5400000,
      monthlyAverage: 3300000
    },
    cards: {
      total: 4,
      thisMonth: 1250000,
      lastMonth: 980000,
      change: 27.5
    },
    budget: {
      planned: 4500000,
      actual: 3890000,
      remaining: 610000,
      achievementRate: 86.4
    }
  }

  const planningModules = [
    {
      title: '고정비 관리',
      description: '연간/월간 고정지출 관리',
      path: '/planning/fixed-expenses',
      icon: Calendar,
      color: 'bg-blue-50 border-blue-200',
      stats: [
        { label: '월평균 고정비', value: `${mockData.fixedExpenses.monthlyAverage.toLocaleString()}원` },
        { label: '이번달 고정비', value: `${mockData.fixedExpenses.monthly.toLocaleString()}원` }
      ]
    },
    {
      title: '카드 관리',
      description: '신용/체크카드 사용 현황',
      path: '/planning/cards',
      icon: CreditCard,
      color: 'bg-green-50 border-green-200',
      stats: [
        { label: '등록된 카드', value: `${mockData.cards.total}개` },
        { label: '이번달 사용액', value: `${mockData.cards.thisMonth.toLocaleString()}원` }
      ]
    },
    {
      title: '지출계획 관리',
      description: '카테고리별 예산 계획 및 실행',
      path: '/planning/spending-plan',
      icon: PieChart,
      color: 'bg-purple-50 border-purple-200',
      stats: [
        { label: '예산 달성률', value: `${mockData.budget.achievementRate}%` },
        { label: '잉여 예산', value: `${mockData.budget.remaining.toLocaleString()}원` }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">계획 관리</h1>
        <p className="text-muted-foreground">
          고정비, 카드, 지출계획을 체계적으로 관리하세요
        </p>
      </div>

      {/* 전체 요약 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">월평균 고정비</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.fixedExpenses.monthlyAverage.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">
              연간 고정비 포함
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">카드 사용액</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.cards.thisMonth.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={mockData.cards.change > 0 ? 'text-red-600' : 'text-green-600'}>
                {mockData.cards.change > 0 ? '+' : ''}{mockData.cards.change}%
              </span> 전월 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">예산 달성률</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.budget.achievementRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              계획 대비 실행률
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">잉여 예산</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockData.budget.remaining.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">
              이번달 남은 예산
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 모듈별 카드 */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {planningModules.map((module) => {
          const Icon = module.icon
          return (
            <Card key={module.path} className={`${module.color} hover:shadow-md transition-shadow`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 통계 정보 */}
                <div className="space-y-2">
                  {module.stats.map((stat, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="font-medium">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* 바로가기 버튼 */}
                <Link
                  to={module.path}
                  className="flex items-center justify-center w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  관리하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 최근 활동 (추후 구현) */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            최근 계획 관리 활동 내역 (추후 구현 예정)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}