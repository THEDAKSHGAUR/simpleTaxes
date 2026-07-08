import { useState } from 'react';
import { TrendingUp, Plus, Trash2, Info, PieChart } from 'lucide-react';
import { calculateCapitalGainsTax, formatCurrency, CapitalGains } from '../lib/tax-utils';
import { useTaxData, CapitalGainEntry } from '../contexts/TaxDataContext';

export default function CapitalGainsCalculator() {
  const { taxData, updateTaxData, saving } = useTaxData();
  const gains = taxData.capital_gains;

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGain, setNewGain] = useState<Partial<CapitalGains>>({
    type: 'STCG',
    amount: 0,
  });

  const gainTypes = [
    { value: 'STCG', label: 'Short-term Equity (STCG)', rate: '20%', exempt: 'Nil' },
    { value: 'LTCG', label: 'Long-term Equity (LTCG)', rate: '12.5%', exempt: '₹1.25L' },
    { value: 'STCG_debt', label: 'Short-term Debt (STCG)', rate: 'Slab Rate', exempt: 'Nil' },
    { value: 'LTCG_debt', label: 'Long-term Debt (LTCG)', rate: '12.5%', exempt: 'Nil' },
  ];

  const addGain = () => {
    if (newGain.type && newGain.amount && newGain.amount > 0) {
      const entry: CapitalGainEntry = {
        id: Date.now().toString(),
        type: newGain.type as CapitalGainEntry['type'],
        amount: newGain.amount,
      };
      updateTaxData({ capital_gains: [...gains, entry] });
      setNewGain({ type: 'STCG', amount: 0 });
      setShowAddForm(false);
    }
  };

  const removeGain = (id: string) => {
    updateTaxData({ capital_gains: gains.filter((g) => g.id !== id) });
  };

  const totalTax = calculateCapitalGainsTax(gains);
  const totalGains = gains.reduce((sum, g) => sum + g.amount, 0);
  const hasDebtSTCG = gains.some((g) => g.type === 'STCG_debt');

  const getGainDetails = (type: CapitalGains['type']) => {
    switch (type) {
      case 'STCG':
        return { exempt: 0, rate: 0.20, description: 'Equity held < 1 year' };
      case 'LTCG':
        return { exempt: 125000, rate: 0.125, description: 'Equity held > 1 year' };
      case 'STCG_debt':
        return { exempt: 0, rate: 0, description: 'Debt held < 3 years (taxed at your income slab rate)' };
      case 'LTCG_debt':
        return { exempt: 0, rate: 0.125, description: 'Debt held > 3 years (12.5% flat, no indexation)' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Capital Gains Tax Calculator</h2>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs text-gray-400">Saving...</span>}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Gain</span>
          </button>
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Capital Gains Tax Rules (post Budget 2024)</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>STCG (Equity):</strong> 20% flat, no exemption (holding period {'<'} 1 year)</li>
              <li><strong>LTCG (Equity):</strong> 12.5% on gains above ₹1.25 lakh (holding period {'>'} 1 year)</li>
              <li><strong>STCG (Debt):</strong> Taxed as per your income slab (holding period {'<'} 3 years)</li>
              <li><strong>LTCG (Debt):</strong> 12.5% flat, no indexation (holding period {'>'} 3 years)</li>
            </ul>
          </div>
        </div>
      </div>

      {hasDebtSTCG && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          You have Short-term Debt gains entered. These aren't taxed at a flat rate — they get added to your
          total income and taxed at your slab rate. To see their real tax impact, add this amount as an
          "Other" income source on the Income Sources tab; it isn't included in "Tax Liability" below.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Total Capital Gains</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalGains)}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-50 rounded-lg">
              <PieChart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Tax Liability</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalTax)}</p>
            <p className="text-xs text-gray-500">Excludes debt-STCG (see note above)</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Effective Rate</p>
            <p className="text-2xl font-bold text-gray-800">
              {totalGains > 0 ? ((totalTax / totalGains) * 100).toFixed(2) : '0'}%
            </p>
          </div>
        </div>
      </div>

      {/* Add Gain Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Capital Gain</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gain Type</label>
              <select
                value={newGain.type}
                onChange={(e) => setNewGain({ ...newGain, type: e.target.value as CapitalGains['type'] })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {gainTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            {newGain.type && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <strong>Tax Rate:</strong> {gainTypes.find(t => t.value === newGain.type)?.rate} |
                  <strong> Exemption Limit:</strong> {gainTypes.find(t => t.value === newGain.type)?.exempt}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gain Amount (₹)</label>
              <input
                type="number"
                value={newGain.amount || ''}
                onChange={(e) => setNewGain({ ...newGain, amount: parseFloat(e.target.value) || 0 })}
                placeholder="Enter profit amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={addGain}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Gain
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gains List */}
      {gains.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Capital Gains Breakdown</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gain</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {gains.map((gain) => {
                const details = getGainDetails(gain.type);
                const taxableAmount = Math.max(0, gain.amount - details.exempt);
                const tax = taxableAmount * details.rate;

                return (
                  <tr key={gain.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {gainTypes.find(t => t.value === gain.type)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{details.description}</p>
                      {details.exempt > 0 && (
                        <p className="text-xs text-gray-500">Exempt: {formatCurrency(details.exempt)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(gain.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {gain.type === 'STCG_debt' ? 'Taxed at slab' : formatCurrency(tax)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => removeGain(gain.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No capital gains added yet. Click "Add Gain" to calculate tax on your investments.</p>
        </div>
      )}

      {/* Tax Saving Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Saving Strategies for Capital Gains</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium text-gray-800">Hold for Long Term</h4>
            <p className="text-sm text-gray-600">Hold equity investments for {'>'}1 year to qualify for LTCG with lower tax rate</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium text-gray-800">Harvest Losses</h4>
            <p className="text-sm text-gray-600">Set off capital gains against capital losses to reduce tax liability</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-medium text-gray-800">Use Exemption Limits</h4>
            <p className="text-sm text-gray-600">Plan sales to stay within exemption limits (₹1.25L for LTCG equity)</p>
          </div>
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-medium text-gray-800">Invest in Tax-Free Bonds</h4>
            <p className="text-sm text-gray-600">Consider tax-free bonds for completely tax-free returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}