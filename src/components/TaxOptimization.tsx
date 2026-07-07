import { useState } from 'react';
import { Lightbulb, TrendingUp, Target, CheckCircle } from 'lucide-react';
import { formatCurrency, compareRegimes } from '../lib/tax-utils';
import { useTaxData } from '../contexts/TaxDataContext';

interface OptimizationTip {
  id: string;
  category: 'deduction' | 'investment' | 'regime' | 'exemption';
  title: string;
  description: string;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
  actionRequired: string;
}

export default function TaxOptimization() {
  const { taxData } = useTaxData();
  const initialIncome = taxData.income_sources.reduce((sum, s) => sum + s.amount, 0);
  const initialDeductions = taxData.deductions.reduce((sum, d) => sum + d.amount, 0);

  const [income, setIncome] = useState(initialIncome);
  const [deductions, setDeductions] = useState(initialDeductions);
  const [age, setAge] = useState(30);
  const [hasHealthInsurance, setHasHealthInsurance] = useState(false);
  const [hasHomeLoan, setHasHomeLoan] = useState(false);
  const [livingInRentedHouse, setLivingInRentedHouse] = useState(false);

  // This tool respects your actual saved regime — most Chapter VI-A deductions
  // (80C, 80D, NPS 80CCD(1B), home loan interest, HRA exemption) are legally
  // disallowed under the New Regime, so those tips only make sense under Old Regime.
  const regime = taxData.regime;

  const [recommendations, setRecommendations] = useState<OptimizationTip[]>([]);

  const generateRecommendations = () => {
    const tips: OptimizationTip[] = [];
    const comparison = compareRegimes(income, deductions);

    // Regime recommendation
    if (comparison.savings > 10000) {
      tips.push({
        id: 'regime',
        category: 'regime',
        title: `Switch to ${comparison.recommended === 'new' ? 'New' : 'Old'} Tax Regime`,
        description: comparison.recommended === 'new' 
          ? 'New regime offers lower tax rates with fewer deductions. Ideal if you don\'t have many deductions.'
          : 'Old regime allows more deductions. Optimize your investments to maximize tax savings.',
        potentialSavings: comparison.savings,
        priority: 'high',
        actionRequired: comparison.recommended === 'new' 
          ? 'Evaluate if you can forego deductions for lower rates'
          : 'Maximize deductions under Section 80C, 80D, etc.',
      });
    }

    // Section 80C recommendations — only valid under Old Regime
    if (regime === 'old') {
      const current80C = deductions; // Simplified for demo
      if (current80C < 150000) {
        const remaining = 150000 - current80C;
        const taxSaved = remaining * 0.3; // Assuming 30% bracket
        tips.push({
          id: '80c',
          category: 'deduction',
          title: 'Maximize Section 80C Deductions',
          description: `You can still invest ₹${remaining.toLocaleString('en-IN')} under Section 80C to reduce taxable income.`,
          potentialSavings: taxSaved,
          priority: 'high',
          actionRequired: 'Invest in PPF, ELSS, EPF, LIC, or tuition fees',
        });
      }
    }

    // Health insurance recommendation — 80D only valid under Old Regime
    if (regime === 'old' && !hasHealthInsurance) {
      tips.push({
        id: 'health',
        category: 'deduction',
        title: 'Get Health Insurance (Section 80D)',
        description: 'Health insurance premium for self and family (up to ₹25,000) and parents (up to ₹50,000 for senior citizens) is deductible.',
        potentialSavings: age > 60 ? 15000 : 7500,
        priority: 'medium',
        actionRequired: 'Purchase health insurance policy',
      });
    }

    // NPS recommendation — 80CCD(1B) only valid under Old Regime
    if (regime === 'old') {
      tips.push({
        id: 'nps',
        category: 'investment',
        title: 'Invest in NPS (Section 80CCD(1B))',
        description: 'Additional ₹50,000 deduction available for NPS contributions over and above Section 80C limit.',
        potentialSavings: 15000,
        priority: 'medium',
        actionRequired: 'Open NPS account and contribute ₹50,000',
      });
    }

    // HRA recommendation — Section 10(13A) exemption only valid under Old Regime
    if (regime === 'old' && livingInRentedHouse && income > 500000) {
      tips.push({
        id: 'hra',
        category: 'exemption',
        title: 'Claim HRA Exemption',
        description: 'If you receive HRA and live in rented accommodation, you can claim exemption under Section 10(13A).',
        potentialSavings: Math.min(income * 0.1, 60000),
        priority: 'high',
        actionRequired: 'Submit rent receipts and landlord details to employer',
      });
    }

    // Home loan recommendation — Section 24(b) only valid under Old Regime
    if (regime === 'old' && hasHomeLoan) {
      tips.push({
        id: 'homeloan',
        category: 'deduction',
        title: 'Claim Home Loan Interest Deduction',
        description: 'Interest on home loan up to ₹2 lakh per year is deductible under Section 24(b).',
        potentialSavings: 60000,
        priority: 'high',
        actionRequired: 'Submit interest certificate from bank to employer',
      });
    }

    // Standard deduction reminder — amount differs by regime, ₹75,000 (new) / ₹50,000 (old)
    const standardDeductionAmount = regime === 'new' ? 75000 : 50000;
    tips.push({
      id: 'standard',
      category: 'deduction',
      title: 'Claim Standard Deduction',
      description: `Salaried individuals can claim a standard deduction of ₹${standardDeductionAmount.toLocaleString('en-IN')} from gross salary under the ${regime === 'new' ? 'New' : 'Old'} Regime.`,
      potentialSavings: Math.round(standardDeductionAmount * 0.3),
      priority: 'high',
      actionRequired: 'Ensure standard deduction is claimed in Form 16',
    });

    setRecommendations(tips.sort((a, b) => b.potentialSavings - a.potentialSavings));
  };

  const totalPotentialSavings = recommendations.reduce((sum, tip) => sum + tip.potentialSavings, 0);

  const getCategoryIcon = (category: OptimizationTip['category']) => {
    switch (category) {
      case 'deduction':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'investment':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'regime':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'exemption':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
    }
  };

  const getPriorityColor = (priority: OptimizationTip['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Tax Optimization</h2>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Your Financial Profile</h3>
        <p className="text-sm text-gray-500 mb-4">
          Income and deductions are prefilled from your saved data. Recommendations are based on your current{' '}
          <span className="font-medium">{regime === 'new' ? 'New' : 'Old'} Regime</span> selection — deduction-based tips
          only apply under the Old Regime.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (₹)</label>
            <input
              type="number"
              value={income || ''}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              placeholder="Enter your annual income"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Deductions (₹)</label>
            <input
              type="number"
              value={deductions || ''}
              onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
              placeholder="Enter current deductions"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              value={age || ''}
              onChange={(e) => setAge(parseFloat(e.target.value) || 0)}
              placeholder="Your age"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={hasHealthInsurance}
              onChange={(e) => setHasHealthInsurance(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <span className="text-sm text-gray-700">Have Health Insurance</span>
          </label>
          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={hasHomeLoan}
              onChange={(e) => setHasHomeLoan(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <span className="text-sm text-gray-700">Have Home Loan</span>
          </label>
          <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={livingInRentedHouse}
              onChange={(e) => setLivingInRentedHouse(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <span className="text-sm text-gray-700">Living in Rented House</span>
          </label>
        </div>

        <button
          onClick={generateRecommendations}
          className="mt-6 w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Generate Optimization Recommendations
        </button>
      </div>

      {/* Results Section */}
      {recommendations.length > 0 && (
        <>
          {/* Summary */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Potential Tax Savings</p>
                <p className="text-4xl font-bold">{formatCurrency(totalPotentialSavings)}</p>
                <p className="text-sm opacity-90 mt-2">Based on {recommendations.length} recommendations</p>
              </div>
              <Lightbulb className="w-16 h-16 opacity-80" />
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalized Recommendations</h3>
            <div className="space-y-4">
              {recommendations.map((tip) => (
                <div key={tip.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getCategoryIcon(tip.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-800">{tip.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(tip.priority)}`}>
                            {tip.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-green-600 font-medium">
                            Save {formatCurrency(tip.potentialSavings)}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{tip.actionRequired}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Action Plan</h3>
            <div className="space-y-3">
              {recommendations.filter(r => r.priority === 'high').map((tip, index) => (
                <div key={tip.id} className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{tip.title}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* General Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">General Tax Saving Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Start Early</h4>
              <p className="text-sm text-gray-600">Plan your tax-saving investments at the beginning of the financial year</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Diversify Investments</h4>
              <p className="text-sm text-gray-600">Spread investments across different sections to maximize benefits</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Keep Documents Ready</h4>
              <p className="text-sm text-gray-600">Maintain proper documentation for all investments and expenses</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Review Annually</h4>
              <p className="text-sm text-gray-600">Review your tax strategy every year as rules and income change</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
