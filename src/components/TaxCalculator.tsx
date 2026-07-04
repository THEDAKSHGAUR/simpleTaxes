import { useState } from 'react';
import { Calculator, TrendingUp, Info } from 'lucide-react';
import { calculateTax, compareRegimes, formatCurrency, TaxResult } from '../lib/tax-utils';

export default function TaxCalculator() {
  const [income, setIncome] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [regime, setRegime] = useState<'new' | 'old'>('new');
  const [showComparison, setShowComparison] = useState(false);

  const taxResult = calculateTax(income, deductions, regime);
  const comparison = showComparison ? compareRegimes(income, deductions) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Tax Calculator</h2>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Enter Your Income Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gross Income (₹)</label>
            <input
              type="number"
              value={income || ''}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              placeholder="Enter your total income"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Deductions (₹)</label>
            <input
              type="number"
              value={deductions || ''}
              onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
              placeholder="Enter total deductions"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Regime Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Tax Regime</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setRegime('new')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                regime === 'new'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span className="font-medium">New Regime</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Lower rates, fewer deductions</p>
            </button>
            <button
              onClick={() => setRegime('old')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                regime === 'old'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Old Regime</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Higher rates, more deductions</p>
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowComparison(!showComparison)}
          className="mt-6 w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          {showComparison ? 'Hide Regime Comparison' : 'Compare Both Regimes'}
        </button>
      </div>

      {/* Tax Results */}
      {income > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Calculation - {regime === 'new' ? 'New Regime' : 'Old Regime'}</h3>
          <TaxResultDisplay result={taxResult} />
        </div>
      )}

      {/* Regime Comparison */}
      {showComparison && comparison && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Regime Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg ${comparison.recommended === 'new' ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
              <h4 className="font-semibold text-gray-800 mb-3">New Regime</h4>
              <TaxResultDisplay result={comparison.newRegime} />
            </div>
            <div className={`p-4 rounded-lg ${comparison.recommended === 'old' ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
              <h4 className="font-semibold text-gray-800 mb-3">Old Regime</h4>
              <TaxResultDisplay result={comparison.oldRegime} />
            </div>
          </div>
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-indigo-600" />
              <span className="font-medium text-indigo-800">
                Recommendation: Choose {comparison.recommended === 'new' ? 'New Regime' : 'Old Regime'}
              </span>
            </div>
            <p className="text-sm text-indigo-700 mt-2">
              You can save {formatCurrency(comparison.savings)} by opting for the {comparison.recommended === 'new' ? 'New' : 'Old'} Regime
            </p>
          </div>
        </div>
      )}

      {/* Tax Slab Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Tax Slabs (FY 2024-25)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">New Regime</h4>
            <TaxSlabTable
              slabs={[
                { range: '₹0 - ₹3L', rate: '0%' },
                { range: '₹3L - ₹7L', rate: '5%' },
                { range: '₹7L - ₹10L', rate: '10%' },
                { range: '₹10L - ₹12L', rate: '15%' },
                { range: '₹12L - ₹15L', rate: '20%' },
                { range: 'Above ₹15L', rate: '30%' },
              ]}
            />
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Old Regime</h4>
            <TaxSlabTable
              slabs={[
                { range: '₹0 - ₹2.5L', rate: '0%' },
                { range: '₹2.5L - ₹5L', rate: '5%' },
                { range: '₹5L - ₹10L', rate: '20%' },
                { range: 'Above ₹10L', rate: '30%' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TaxResultDisplay({ result }: { result: TaxResult }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center py-2 border-b">
        <span className="text-gray-600">Gross Income</span>
        <span className="font-medium">{formatCurrency(result.grossIncome)}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b">
        <span className="text-gray-600">Total Deductions</span>
        <span className="font-medium text-red-600">-{formatCurrency(result.totalDeductions)}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b">
        <span className="text-gray-600">Taxable Income</span>
        <span className="font-semibold">{formatCurrency(result.taxableIncome)}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b">
        <span className="text-gray-600">Tax Before Cess</span>
        <span className="font-medium">{formatCurrency(result.taxBeforeCess)}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b">
        <span className="text-gray-600">Health & Education Cess (4%)</span>
        <span className="font-medium">{formatCurrency(result.healthAndEducationCess)}</span>
      </div>
      <div className="flex justify-between items-center py-3 bg-indigo-50 rounded-lg px-3">
        <span className="font-semibold text-gray-800">Total Tax Liability</span>
        <span className="font-bold text-xl text-indigo-600">{formatCurrency(result.totalTax)}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600">Effective Tax Rate</span>
        <span className="font-medium">{result.effectiveRate.toFixed(2)}%</span>
      </div>
    </div>
  );
}

function TaxSlabTable({ slabs }: { slabs: { range: string; rate: string }[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2 text-left text-gray-600">Income Range</th>
          <th className="py-2 text-right text-gray-600">Tax Rate</th>
        </tr>
      </thead>
      <tbody>
        {slabs.map((slab, index) => (
          <tr key={index} className="border-b">
            <td className="py-2 text-gray-800">{slab.range}</td>
            <td className="py-2 text-right font-medium text-indigo-600">{slab.rate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
