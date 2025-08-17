import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import Assets from './pages/Assets'
import Portfolio from './pages/Portfolio'
import AssetOverview from './pages/AssetOverview'
import PlanningDashboard from './pages/planning/PlanningDashboard'
import FixedExpenses from './pages/planning/FixedExpenses'
import CardManagement from './pages/planning/CardManagement'
import SpendingPlan from './pages/planning/SpendingPlan'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/asset-overview" element={<AssetOverview />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/planning" element={<PlanningDashboard />} />
            <Route path="/planning/fixed-expenses" element={<FixedExpenses />} />
            <Route path="/planning/cards" element={<CardManagement />} />
            <Route path="/planning/spending-plan" element={<SpendingPlan />} />
          </Routes>
        </Layout>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App