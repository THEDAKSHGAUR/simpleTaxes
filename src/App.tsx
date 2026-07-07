import { useState } from 'react'
import { Calculator, FileText, TrendingUp, Shield, Upload, Calendar, Download, LogOut } from 'lucide-react'
import IncomeSources from './components/IncomeSources'
import Deductions from './components/Deductions'
import TaxCalculator from './components/TaxCalculator'
import TaxOptimization from './components/TaxOptimization'
import ITRFiling from './components/ITRFiling'
import InvestmentSuggestions from './components/InvestmentSuggestions'
import HRACalculator from './components/HRACalculator'
import CapitalGainsCalculator from './components/CapitalGainsCalculator'
import Login from './components/Login'
import UserProfile from './components/UserProfile'
import { TaxDataProvider, useTaxData } from './contexts/TaxDataContext'
import { supabase } from './lib/supabase'
import { calculateTax } from './lib/tax-utils'

function AppContent() {
  const { session, profile, loading } = useTaxData()
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'dashboard'
  })

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem('activeTab', tab)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // const handleProfileUpdate = (updatedUser: { email: string; name: string; profilePhoto?: string }) => {
  //   updateProfile({
  //     full_name: updatedUser.name,
  //     email: updatedUser.email,
  //     profile_photo_url: updatedUser.profilePhoto,
  //   })
  // }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-500">Loading your data...</p>
      </div>
    )
  }

  if (!session) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">SimpleTaxes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative group cursor-pointer" onClick={() => handleTabChange('profile')}>
                  {profile?.profile_photo_url ? (
                    <img
                      src={profile.profile_photo_url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-300 hover:ring-2 hover:ring-indigo-300 transition-all"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold hover:ring-2 hover:ring-indigo-300 transition-all">
                      {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">Edit</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome,</p>
                  <p className="font-medium text-gray-800">{profile?.full_name || 'User'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'income', label: 'Income Sources' },
              { id: 'deductions', label: 'Deductions' },
              { id: 'taxcalc', label: 'Tax Calculator' },
              { id: 'hra', label: 'HRA Calculator' },
              { id: 'capitalgains', label: 'Capital Gains' },
              { id: 'optimization', label: 'Tax Optimization' },
              { id: 'investments', label: 'Investments' },
              { id: 'itr', label: 'ITR Filing' },
              { id: 'profile', label: 'Profile' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'income' && <IncomeSources />}
        {activeTab === 'deductions' && <Deductions />}
        {activeTab === 'taxcalc' && <TaxCalculator />}
        {activeTab === 'hra' && <HRACalculator />}
        {activeTab === 'capitalgains' && <CapitalGainsCalculator />}
        {activeTab === 'optimization' && <TaxOptimization />}
        {activeTab === 'investments' && <InvestmentSuggestions />}
        {activeTab === 'itr' && <ITRFiling />}
        {activeTab === 'profile' && <UserProfile />}
      </main>
    </div>
  )
}

function Dashboard() {
  const { taxData, updateTaxData } = useTaxData()

  const totalIncome = taxData.income_sources.reduce((sum, s) => sum + s.amount, 0)
  const otherDeductions = taxData.deductions.reduce((sum, d) => sum + d.amount, 0)

  const result = calculateTax(totalIncome, otherDeductions, taxData.regime, taxData.is_salaried)
  const withoutDeductions = calculateTax(totalIncome, 0, taxData.regime, false)
  const taxSaved = Math.max(0, withoutDeductions.totalTax - result.totalTax)

  const formatCurrency = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

  const itrStatusLabel: Record<string, string> = {
    not_filed: 'Not Filed',
    in_progress: 'In Progress',
    filed: 'Filed',
  }
  const handleRegimeChange = (regime: 'new' | 'old') => {
    updateTaxData({ regime })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Tax Dashboard</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleRegimeChange('new')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${taxData.regime === 'new' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'}`}
          >
            New Regime
          </button>
          <button
            onClick={() => handleRegimeChange('old')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${taxData.regime === 'old' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'}`}
          >
            Old Regime
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={TrendingUp}
          title="Total Income"
          value={formatCurrency(totalIncome)}
          description="Current Financial Year"
          color="blue"
        />
        <StatCard
          icon={Shield}
          title="Tax Saved"
          value={formatCurrency(taxSaved)}
          description="Through Deductions"
          color="green"
        />
        <StatCard
          icon={Calculator}
          title="Estimated Tax"
          value={formatCurrency(result.totalTax)}
          description={`${taxData.regime === 'new' ? 'New' : 'Old'} Regime`}
          color="red"
        />
        <StatCard
          icon={FileText}
          title="ITR Status"
          value={itrStatusLabel[taxData.itr_status] || 'Not Filed'}
          description="AY 2026-27"
          color="purple"
        />
      </div>

      {totalIncome === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          Add your income sources to see real numbers here instead of zeros.
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          icon={Upload}
          title="Upload Documents"
          description="Upload Form 16, investment proofs"
        />
        <QuickActionCard
          icon={Calendar}
          title="Tax Calendar"
          description="Important dates and deadlines"
        />
        <QuickActionCard
          icon={Download}
          title="Export Reports"
          description="Download tax summary"
        />
      </div>

      {/* Tax Saving Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Saving Tips</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-700">Invest up to ₹1.5 lakh under Section 80C (PPF, ELSS, EPF)</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-700">Claim HRA exemption if you live in rented accommodation</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-700">Health insurance premium under Section 80D (up to ₹75,000)</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-700">NPS contribution under Section 80CCD(1B) (up to ₹50,000)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, title, value, description, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  )
}

function QuickActionCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <TaxDataProvider>
      <AppContent />
    </TaxDataProvider>
  )
}

export default App
