import { useState } from 'react';
import { TrendingUp, Shield, Clock, Percent, Info } from 'lucide-react';

interface InvestmentOption {
  id: string;
  name: string;
  section: string;
  maxLimit: number;
  lockInPeriod: string;
  riskLevel: 'low' | 'medium' | 'high';
  returns: string;
  description: string;
  pros: string[];
  cons: string[];
}

const INVESTMENT_OPTIONS: InvestmentOption[] = [
  {
    id: 'ppf',
    name: 'Public Provident Fund (PPF)',
    section: '80C',
    maxLimit: 150000,
    lockInPeriod: '15 years',
    riskLevel: 'low',
    returns: '7.1% (compounded annually)',
    description: 'Government-backed savings scheme with tax-free interest and maturity amount',
    pros: [
      'Tax-free interest and maturity',
      'Government-backed (sovereign guarantee)',
      'Loan facility available from 3rd year',
      'Partial withdrawal allowed after 7 years',
    ],
    cons: [
      'Long lock-in period (15 years)',
      'Low liquidity',
      'Interest rate subject to change',
      'Annual investment limit of ₹1.5 lakh',
    ],
  },
  {
    id: 'elss',
    name: 'Equity Linked Savings Scheme (ELSS)',
    section: '80C',
    maxLimit: 150000,
    lockInPeriod: '3 years',
    riskLevel: 'high',
    returns: '12-15% (historical)',
    description: 'Mutual funds that invest primarily in equity with shortest lock-in among 80C options',
    pros: [
      'Shortest lock-in period (3 years)',
      'Potential for high returns',
      'Dividend option available',
      'Professional fund management',
    ],
    cons: [
      'Market-linked returns (risk of loss)',
      'No guaranteed returns',
      'NAV fluctuates daily',
      'Not suitable for conservative investors',
    ],
  },
  {
    id: 'nps',
    name: 'National Pension System (NPS)',
    section: '80CCD(1B)',
    maxLimit: 50000,
    lockInPeriod: 'Until retirement (60 years)',
    riskLevel: 'medium',
    returns: '9-12% (historical)',
    description: 'Government-sponsored pension scheme with additional tax benefit of ₹50,000',
    pros: [
      'Additional ₹50,000 deduction over 80C',
      'Low expense ratio',
      'Professional fund management',
      'Partial withdrawal allowed after retirement',
    ],
    cons: [
      'Locked until retirement',
      'Mandatory annuity purchase (40% of corpus)',
      'Not completely tax-free at withdrawal',
      'Limited investment choices',
    ],
  },
  {
    id: 'lic',
    name: 'Life Insurance Premium',
    section: '80C',
    maxLimit: 150000,
    lockInPeriod: 'Policy term',
    riskLevel: 'low',
    returns: '4-6% (traditional plans)',
    description: 'Life insurance policies that provide both protection and tax benefits',
    pros: [
      'Life insurance coverage',
      'Tax-free maturity amount (for traditional plans)',
      'Various plan options available',
      'Loan facility available',
    ],
    cons: [
      'Low returns compared to other options',
      'Long lock-in period',
      'High charges in ULIP plans',
      'Complex product structure',
    ],
  },
  {
    id: 'fd',
    name: 'Tax-Saving Fixed Deposit (5-year)',
    section: '80C',
    maxLimit: 150000,
    lockInPeriod: '5 years',
    riskLevel: 'low',
    returns: '6.5-7.5%',
    description: 'Bank fixed deposits with 5-year lock-in period eligible for 80C deduction',
    pros: [
      'Guaranteed returns',
      'No market risk',
      'Available at all banks',
      'Easy to understand',
    ],
    cons: [
      'Interest is taxable',
      '5-year lock-in period',
      'Low returns compared to inflation',
      'No premature withdrawal allowed',
    ],
  },
  {
    id: 'sukanya',
    name: 'Sukanya Samriddhi Yojana',
    section: '80C',
    maxLimit: 150000,
    lockInPeriod: 'Until marriage (21 years)',
    riskLevel: 'low',
    returns: '8.2%',
    description: 'Government scheme for girl child with high interest rate and tax benefits',
    pros: [
      'High interest rate (8.2%)',
      'Tax-free interest and maturity',
      'Government-backed',
      'Partial withdrawal allowed for education',
    ],
    cons: [
      'Only for girl child',
      'Long lock-in period',
      'Limited to 2 accounts per family',
      'Account must be opened before age 10',
    ],
  },
];

export default function InvestmentSuggestions() {
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentOption | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  const getRiskColor = (risk: InvestmentOption['riskLevel']) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
    }
  };

  const getRecommendedOptions = () => {
    switch (riskProfile) {
      case 'conservative':
        return INVESTMENT_OPTIONS.filter(opt => opt.riskLevel === 'low');
      case 'moderate':
        return INVESTMENT_OPTIONS.filter(opt => opt.riskLevel === 'low' || opt.riskLevel === 'medium');
      case 'aggressive':
        return INVESTMENT_OPTIONS;
    }
  };

  const recommendedOptions = getRecommendedOptions();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Tax-Saving Investment Suggestions</h2>

      {/* Risk Profile Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Risk Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setRiskProfile('conservative')}
            className={`p-4 rounded-lg border-2 transition-all ${
              riskProfile === 'conservative'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <Shield className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <h4 className="font-medium text-center">Conservative</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Low risk, stable returns</p>
          </button>
          <button
            onClick={() => setRiskProfile('moderate')}
            className={`p-4 rounded-lg border-2 transition-all ${
              riskProfile === 'moderate'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <h4 className="font-medium text-center">Moderate</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Balanced risk and returns</p>
          </button>
          <button
            onClick={() => setRiskProfile('aggressive')}
            className={`p-4 rounded-lg border-2 transition-all ${
              riskProfile === 'aggressive'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-red-600" />
            <h4 className="font-medium text-center">Aggressive</h4>
            <p className="text-xs text-gray-500 text-center mt-1">High risk, high returns</p>
          </button>
        </div>
      </div>

      {/* Investment Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recommended Investment Options ({recommendedOptions.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedOptions.map((option) => (
            <div
              key={option.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedInvestment(option)}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{option.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(option.riskLevel)}`}>
                  {option.riskLevel}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{option.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Section:</span>
                  <span className="font-medium text-indigo-600">{option.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Max Limit:</span>
                  <span className="font-medium">₹{option.maxLimit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lock-in:</span>
                  <span className="font-medium">{option.lockInPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Returns:</span>
                  <span className="font-medium text-green-600">{option.returns}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Detail Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedInvestment.name}</h3>
                  <p className="text-sm text-indigo-600">{selectedInvestment.section}</p>
                </div>
                <button
                  onClick={() => setSelectedInvestment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-600 mb-6">{selectedInvestment.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Max Limit</p>
                  <p className="font-semibold">₹{selectedInvestment.maxLimit.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Lock-in</p>
                  <p className="font-semibold">{selectedInvestment.lockInPeriod}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Risk Level</p>
                  <p className={`font-semibold ${getRiskColor(selectedInvestment.riskLevel).split(' ')[1]}`}>
                    {selectedInvestment.riskLevel}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Returns</p>
                  <p className="font-semibold text-green-600">{selectedInvestment.returns}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                    Pros
                  </h4>
                  <ul className="space-y-1">
                    {selectedInvestment.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-red-600" />
                    Cons
                  </h4>
                  <ul className="space-y-1">
                    {selectedInvestment.cons.map((con, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Investment Calculator</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <input
                        type="number"
                        value={investmentAmount || ''}
                        onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || 0)}
                        placeholder="Enter amount"
                        className="border border-blue-300 rounded px-3 py-2 w-40"
                      />
                      <span className="text-sm">
                        Tax Savings: <strong>₹{(investmentAmount * 0.3).toLocaleString('en-IN')}</strong> (assuming 30% bracket)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedInvestment(null)}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Investment Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Start Early</h4>
              <p className="text-sm text-gray-600">Begin tax-saving investments at the start of the financial year to benefit from compounding</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Percent className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Diversify</h4>
              <p className="text-sm text-gray-600">Spread investments across different options to balance risk and returns</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Review Regularly</h4>
              <p className="text-sm text-gray-600">Review your portfolio annually and rebalance based on performance</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Understand Before Investing</h4>
              <p className="text-sm text-gray-600">Read all documents and understand risks before investing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
